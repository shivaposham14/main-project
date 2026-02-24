import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { 
  BookOpen, 
  TrendingUp, 
  ChevronRight, 
  ArrowLeft, 
  Download, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Layout,
  Cpu,
  Globe,
  Shield,
  Cloud,
  Code2,
  Database,
  Search,
  FileText,
  Upload,
  Save,
  X
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { cn } from './lib/utils';
import { Curriculum, IndustryTrend, Subject, Semester } from './types';

// --- Components ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className,
  disabled,
  type = 'button'
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit';
}) => {
  const variants = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md',
    secondary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md',
    outline: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50',
    ghost: 'text-slate-600 hover:bg-slate-100',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-md'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'px-6 py-2.5 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95',
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className, id, onClick }: { children: React.ReactNode; className?: string; id?: string; onClick?: () => void }) => (
  <div id={id} onClick={onClick} className={cn('bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden', className)}>
    {children}
  </div>
);

const Input = ({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-slate-700 ml-1">{label}</label>
    <input
      {...props}
      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
    />
  </div>
);

const Select = ({ label, options, ...props }: { label: string; options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <div className="space-y-1.5">
    <label className="text-sm font-semibold text-slate-700 ml-1">{label}</label>
    <select
      {...props}
      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
    >
      {options.map(opt => (
        <option key={opt} value={opt}>{opt}</option>
      ))}
    </select>
  </div>
);

const SubjectModal = ({ subject, onClose }: { subject: Subject; onClose: () => void }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
    >
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-indigo-600 text-white">
        <div>
          <div className="text-xs font-bold uppercase tracking-widest opacity-80">{subject.code}</div>
          <h2 className="text-2xl font-bold">{subject.name}</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full transition-colors">
          <X size={24} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase mb-1">Credits</div>
            <div className="text-xl font-bold text-indigo-600">{subject.credits}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase mb-1">Hours per Week</div>
            <div className="text-xl font-bold text-indigo-600">{subject.hoursPerWeek || 4}</div>
          </div>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-xs font-bold text-slate-400 uppercase mb-1">Type</div>
            <div className="text-xl font-bold text-indigo-600">{subject.type}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <CheckCircle2 size={20} className="text-emerald-500" /> Learning Outcomes
            </h3>
            <ul className="space-y-2">
              {subject.learningOutcomes?.map((outcome, i) => (
                <li key={i} className="text-sm text-slate-600 flex gap-2">
                  <span className="font-bold text-indigo-600">•</span> {outcome}
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <TrendingUp size={20} className="text-indigo-600" /> Course Outcomes
            </h3>
            <ul className="space-y-2">
              {subject.courseOutcomes?.map((outcome, i) => (
                <li key={i} className="text-sm text-slate-600 flex gap-2">
                  <span className="font-bold text-indigo-600">•</span> {outcome}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-slate-800 border-b border-slate-100 pb-2">Course Content (5 Units)</h3>
          <div className="space-y-4">
            {subject.units?.map((unit) => (
              <div key={unit.unitNumber} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-indigo-200 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-sm">
                    {unit.unitNumber}
                  </div>
                  <h4 className="font-bold text-slate-800">{unit.title}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {unit.topics.map((topic, i) => (
                    <span key={i} className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs text-slate-600">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
        <Button onClick={onClose}>Close Details</Button>
      </div>
    </motion.div>
  </div>
);

// --- Main App ---

export default function App() {
  const [view, setView] = useState<'landing' | 'generate' | 'trends' | 'result'>('landing');
  const [mode, setMode] = useState<'institutional' | 'external' | null>(null);
  const [loading, setLoading] = useState(false);
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [trends, setTrends] = useState<IndustryTrend | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  
  // Form States
  const [formData, setFormData] = useState({
    institutionName: '',
    accreditation: 'Autonomous',
    degree: 'B.Tech',
    duration: '4 Years',
    totalCredits: 160,
    industryAlignment: 80,
    includeInternship: true,
    includeCapstone: true,
    branch: 'CSE',
    specialization: 'AI/ML',
    previousCurriculum: ''
  });

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    try {
      const res = await fetch('/api/industry-trends');
      const data = await res.json();
      setTrends(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });
      
      const systemInstruction = `You are a Senior Curriculum Architect. Generate a production-ready curriculum in JSON format.
      STRICT RULES:
      1. Total 8 semesters.
      2. Exactly 20 credits per semester.
      3. Total exactly 160 credits.
      4. Each semester must include a mix of Core, Adaptive, Emerging, and Elective subjects.
      5. Include 1 Non-Credit subject (e.g., Ethics, Environmental Studies).
      6. Labs are 1 credit.
      7. Difficulty progression: Foundation -> Intermediate -> Advanced.
      8. For Institutional mode, include OBE mapping (Course Outcomes to Program Outcomes) and CO-PO mapping table.
      9. For each subject, provide 5 detailed units with topics, hours per week, learning outcomes, and course outcomes.
      10. Return ONLY a JSON object matching the requested schema.`;

      const prompt = `Generate a ${mode} curriculum for:
      ${JSON.stringify(formData)}
      
      If formData.previousCurriculum is provided, analyze it, identify outdated subjects, and suggest improvements while maintaining the 160-credit structure.
      
      Return JSON with this structure:
      {
        "degree": "string",
        "branch": "string",
        "specialization": "string",
        "semesters": [
          {
            "semester": number,
            "total_credits": 20,
            "subjects": [
              { 
                "code": "string", 
                "name": "string", 
                "credits": number, 
                "type": "Core|Adaptive|Emerging|Elective|Non-Credit", 
                "lab_required": boolean,
                "hoursPerWeek": number,
                "learningOutcomes": ["string"],
                "courseOutcomes": ["string"],
                "units": [
                  { "unitNumber": 1, "title": "string", "topics": ["string"] },
                  { "unitNumber": 2, "title": "string", "topics": ["string"] },
                  { "unitNumber": 3, "title": "string", "topics": ["string"] },
                  { "unitNumber": 4, "title": "string", "topics": ["string"] },
                  { "unitNumber": 5, "title": "string", "topics": ["string"] }
                ]
              }
            ]
          }
        ],
        "total_credits": 160,
        "non_credit_subject": "string",
        "industry_score": number,
        "skill_mapping": { "skill_name": ["subject_names"] },
        "recommendations": ["string"],
        "obe_mapping": { "CO": "string", "PO": "string", "mapping": "string" },
        "co_po_mapping": [
          { "CO": "CO1", "PO1": 3, "PO2": 2, "PO3": 1, "PO4": 0, "PO5": 0, "PO6": 0, "PO7": 0, "PO8": 0, "PO9": 0, "PO10": 0, "PO11": 0, "PO12": 1 },
          { "CO": "CO2", "PO1": 2, "PO2": 3, "PO3": 2, "PO4": 1, "PO5": 0, "PO6": 0, "PO7": 0, "PO8": 0, "PO9": 0, "PO10": 0, "PO11": 0, "PO12": 1 }
        ]
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
        },
      });

      const data = JSON.parse(response.text || "{}");
      setCurriculum(data);
      setView('result');
    } catch (err) {
      console.error("AI Generation Error:", err);
      alert("Failed to generate curriculum. Please check your API key or try again.");
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = () => {
    if (!curriculum) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    const addHeader = (title: string) => {
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text('CurricuForge - Professional Curriculum Design Platform', 14, 10);
      doc.text(new Date().toLocaleDateString(), pageWidth - 40, 10);
      doc.setDrawColor(200);
      doc.line(14, 12, pageWidth - 14, 12);
    };

    const addFooter = (pageNum: number) => {
      doc.setFontSize(10);
      doc.setTextColor(150);
      doc.text(`Page ${pageNum}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      doc.text('Generated by CurricuForge AI', 14, pageHeight - 10);
    };

    // --- Page 1: Cover ---
    addHeader('Cover');
    doc.setFontSize(28);
    doc.setTextColor(79, 70, 229); // Indigo-600
    doc.setFont('helvetica', 'bold');
    doc.text('CURRICULUM REPORT', pageWidth / 2, 60, { align: 'center' });
    
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text(`${curriculum.degree} in ${curriculum.branch}`, pageWidth / 2, 75, { align: 'center' });
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Specialization: ${curriculum.specialization}`, pageWidth / 2, 85, { align: 'center' });
    
    doc.setDrawColor(79, 70, 229);
    doc.setLineWidth(1);
    doc.line(pageWidth / 2 - 40, 95, pageWidth / 2 + 40, 95);

    doc.setFontSize(12);
    doc.text(`Industry Alignment Score: ${curriculum.industry_score}%`, pageWidth / 2, 110, { align: 'center' });
    doc.text(`Total Credits: ${curriculum.total_credits}`, pageWidth / 2, 120, { align: 'center' });
    
    if (formData.institutionName) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(formData.institutionName, pageWidth / 2, 150, { align: 'center' });
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Accreditation: ${formData.accreditation}`, pageWidth / 2, 160, { align: 'center' });
    }

    addFooter(1);

    // --- Page 2: Semester Breakdown ---
    doc.addPage();
    addHeader('Semesters');
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.text('Semester-wise Structure', 14, 25);
    
    let yPos = 35;
    curriculum.semesters.forEach((sem, idx) => {
      if (yPos > 240) {
        addFooter((doc as any).internal.getNumberOfPages());
        doc.addPage();
        addHeader('Semesters');
        yPos = 25;
      }
      
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(30, 41, 59);
      doc.text(`Semester ${sem.semester} - Total Credits: ${sem.total_credits}`, 14, yPos);
      yPos += 5;
      
      (doc as any).autoTable({
        startY: yPos,
        head: [['Code', 'Subject Name', 'Credits', 'Type', 'Lab']],
        body: sem.subjects.map(s => [s.code, s.name, s.credits, s.type, s.lab_required ? 'Yes' : 'No']),
        theme: 'grid',
        headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 9, cellPadding: 3 },
        margin: { left: 14, right: 14 },
      });
      
      yPos = (doc as any).lastAutoTable.finalY + 15;
    });
    addFooter((doc as any).internal.getNumberOfPages());

    // --- Page 3: Accreditation & OBE ---
    doc.addPage();
    addHeader('Accreditation');
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.text('Accreditation & OBE Mapping', 14, 25);

    if (curriculum.obe_mapping) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Course Outcomes (CO):', 14, 40);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const coLines = doc.splitTextToSize(curriculum.obe_mapping.CO, pageWidth - 28);
      doc.text(coLines, 14, 45);
      
      let nextY = 45 + (coLines.length * 5) + 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Program Outcomes (PO):', 14, nextY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const poLines = doc.splitTextToSize(curriculum.obe_mapping.PO, pageWidth - 28);
      doc.text(poLines, 14, nextY + 5);
      
      nextY = nextY + 5 + (poLines.length * 5) + 10;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('CO-PO Mapping Table:', 14, nextY);
      
      if (curriculum.co_po_mapping) {
        (doc as any).autoTable({
          startY: nextY + 5,
          head: [['CO', 'PO1', 'PO2', 'PO3', 'PO4', 'PO5', 'PO6', 'PO7', 'PO8', 'PO9', 'PO10', 'PO11', 'PO12']],
          body: curriculum.co_po_mapping.map(m => [
            m.CO, m.PO1, m.PO2, m.PO3, m.PO4, m.PO5, m.PO6, m.PO7, m.PO8, m.PO9, m.PO10, m.PO11, m.PO12
          ]),
          theme: 'grid',
          headStyles: { fillColor: [30, 41, 59], textColor: 255 },
          styles: { fontSize: 8, halign: 'center' },
        });
      }
    }
    addFooter((doc as any).internal.getNumberOfPages());

    // --- Page 4: Industry Trends & Skills ---
    doc.addPage();
    addHeader('Industry');
    doc.setFontSize(18);
    doc.setTextColor(79, 70, 229);
    doc.text('Industry Alignment & Skill Mapping', 14, 25);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Skill-to-Subject Mapping:', 14, 40);
    
    let skillY = 50;
    Object.entries(curriculum.skill_mapping).forEach(([skill, subjects]) => {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${skill}:`, 14, skillY);
      doc.setFont('helvetica', 'normal');
      doc.text(subjects.join(', '), 40, skillY);
      skillY += 7;
    });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Recommendations:', 14, skillY + 10);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    curriculum.recommendations.forEach((rec, i) => {
      const recLines = doc.splitTextToSize(`${i + 1}. ${rec}`, pageWidth - 28);
      doc.text(recLines, 14, skillY + 20 + (i * 10));
    });

    addFooter((doc as any).internal.getNumberOfPages());

    doc.save(`CurricuForge_${curriculum.branch}_${curriculum.specialization}.pdf`);
  };

  const handleEditSubject = (semIdx: number, subIdx: number, field: keyof Subject, value: any) => {
    if (!curriculum) return;
    const newCurriculum = { ...curriculum };
    (newCurriculum.semesters[semIdx].subjects[subIdx] as any)[field] = value;
    
    // Recalculate semester credits
    const total = newCurriculum.semesters[semIdx].subjects.reduce((acc, s) => acc + Number(s.credits), 0);
    newCurriculum.semesters[semIdx].total_credits = total;
    
    setCurriculum(newCurriculum);
  };

  const addSubject = (semIdx: number) => {
    if (!curriculum) return;
    const newCurriculum = { ...curriculum };
    newCurriculum.semesters[semIdx].subjects.push({
      code: 'NEW101',
      name: 'New Subject',
      credits: 3,
      type: 'Core',
      lab_required: false,
      hoursPerWeek: 3,
      learningOutcomes: ['Understand basic concepts'],
      courseOutcomes: ['Apply knowledge to solve problems'],
      units: [
        { unitNumber: 1, title: 'Introduction', topics: ['Overview'] },
        { unitNumber: 2, title: 'Basics', topics: ['Fundamentals'] },
        { unitNumber: 3, title: 'Intermediate', topics: ['Concepts'] },
        { unitNumber: 4, title: 'Advanced', topics: ['Applications'] },
        { unitNumber: 5, title: 'Conclusion', topics: ['Summary'] }
      ]
    });
    setCurriculum(newCurriculum);
  };

  const removeSubject = (semIdx: number, subIdx: number) => {
    if (!curriculum) return;
    const newCurriculum = { ...curriculum };
    newCurriculum.semesters[semIdx].subjects.splice(subIdx, 1);
    setCurriculum(newCurriculum);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-bottom border-slate-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <BookOpen size={24} />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800">CurricuForge</span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => setView('trends')}>Trends</Button>
          <Button onClick={() => setView('generate')}>Generate</Button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          {/* Landing Page */}
          {view === 'landing' && (
            <motion.div 
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-12 py-12"
            >
              <div className="space-y-6 max-w-3xl mx-auto">
                <h1 className="text-6xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Design the Future of <span className="text-indigo-600">Education</span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  CurricuForge uses advanced AI to build industry-aligned, accreditation-ready curricula for institutions and students in seconds.
                </p>
                <div className="flex items-center justify-center gap-6 pt-4">
                  <Button onClick={() => setView('generate')} className="px-10 py-4 text-lg rounded-2xl">
                    Generate Curriculum <ChevronRight size={20} />
                  </Button>
                  <Button variant="outline" onClick={() => setView('trends')} className="px-10 py-4 text-lg rounded-2xl">
                    View Industry Trends <TrendingUp size={20} />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
                {[
                  { icon: <Cpu className="text-indigo-600" />, title: 'AI-Driven Design', desc: 'Generate 160-credit structures aligned with global standards.' },
                  { icon: <TrendingUp className="text-emerald-600" />, title: 'Industry Aligned', desc: 'Real-time trend analysis ensures students learn what the market demands.' },
                  { icon: <Shield className="text-amber-600" />, title: 'Accreditation Ready', desc: 'OBE and CO-PO mapping for NAAC, NBA, and Autonomous institutions.' }
                ].map((feature, i) => (
                  <Card key={i} className="p-8 text-left hover:border-indigo-200 transition-colors group">
                    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Generate Form */}
          {view === 'generate' && (
            <motion.div 
              key="generate"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="max-w-2xl mx-auto"
            >
              {!mode ? (
                <div className="space-y-8 text-center">
                  <h2 className="text-3xl font-bold">Choose Your Path</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card 
                      className="p-8 cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all group"
                      onClick={() => setMode('institutional')}
                    >
                      <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Globe size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Institutional Design</h3>
                      <p className="text-slate-600 text-sm">For Universities & Colleges. Includes Accreditation reports.</p>
                    </Card>
                    <Card 
                      className="p-8 cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all group"
                      onClick={() => setMode('external')}
                    >
                      <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                        <Code2 size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">External / Personal</h3>
                      <p className="text-slate-600 text-sm">For students & self-learners. Focused on industry skills.</p>
                    </Card>
                  </div>
                </div>
              ) : (
                <Card className="p-8 space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <button onClick={() => setMode(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                      <ArrowLeft size={20} />
                    </button>
                    <h2 className="text-2xl font-bold">
                      {mode === 'institutional' ? 'Institutional Setup' : 'Academic Details'}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {mode === 'institutional' && (
                      <>
                        <Input 
                          label="Institution Name" 
                          placeholder="e.g. Stanford University" 
                          value={formData.institutionName}
                          onChange={e => setFormData({...formData, institutionName: e.target.value})}
                        />
                        <Select 
                          label="Accreditation" 
                          options={['NAAC A++', 'NBA', 'Autonomous', 'Deemed']} 
                          value={formData.accreditation}
                          onChange={e => setFormData({...formData, accreditation: e.target.value})}
                        />
                      </>
                    )}
                    <Select 
                      label="Degree Type" 
                      options={['B.Tech', 'M.Tech', 'Diploma', 'B.Sc', 'M.Sc']} 
                      value={formData.degree}
                      onChange={e => setFormData({...formData, degree: e.target.value})}
                    />
                    <Select 
                      label="Branch" 
                      options={['CSE', 'IT', 'ECE', 'Mechanical', 'Civil', 'Electrical']} 
                      value={formData.branch}
                      onChange={e => setFormData({...formData, branch: e.target.value})}
                    />
                    <Select 
                      label="Specialization" 
                      options={['AI/ML', 'Data Science', 'Cybersecurity', 'Cloud & DevOps', 'Web3', 'Full Stack', 'Core CS']} 
                      value={formData.specialization}
                      onChange={e => setFormData({...formData, specialization: e.target.value})}
                    />
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-sm font-semibold text-slate-700 ml-1">
                        Industry Alignment Target ({formData.industryAlignment}%)
                      </label>
                      <input 
                        type="range" 
                        className="w-full accent-indigo-600" 
                        min="0" max="100" 
                        value={formData.industryAlignment}
                        onChange={e => setFormData({...formData, industryAlignment: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="space-y-1.5 col-span-2">
                      <label className="text-sm font-semibold text-slate-700 ml-1">
                        Previous Curriculum (Optional - Paste to Upgrade)
                      </label>
                      <textarea 
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all min-h-[100px]"
                        placeholder="Paste subjects from your existing curriculum to identify outdated topics..."
                        value={formData.previousCurriculum}
                        onChange={e => setFormData({...formData, previousCurriculum: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        checked={formData.includeInternship}
                        onChange={e => setFormData({...formData, includeInternship: e.target.checked})}
                      />
                      <span className="text-sm font-medium">Include Internship</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        checked={formData.includeCapstone}
                        onChange={e => setFormData({...formData, includeCapstone: e.target.checked})}
                      />
                      <span className="text-sm font-medium">Include Capstone</span>
                    </label>
                  </div>

                  <div className="pt-6">
                    <Button 
                      onClick={handleGenerate} 
                      className="w-full py-4 text-lg" 
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Forging Curriculum...
                        </div>
                      ) : (
                        <>Generate Curriculum <CheckCircle2 size={20} /></>
                      )}
                    </Button>
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {/* Result View */}
          {view === 'result' && curriculum && (
            <motion.div 
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-bold">{curriculum.degree} in {curriculum.branch}</h2>
                  <p className="text-slate-600">Specialization: {curriculum.specialization} • Total Credits: {curriculum.total_credits}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? <><Save size={18} /> Save Changes</> : <><Edit3 size={18} /> Edit Curriculum</>}
                  </Button>
                  <Button onClick={downloadPDF}>
                    <Download size={18} /> Download PDF
                  </Button>
                </div>
              </div>

              {/* Analytics Dashboard */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6 bg-indigo-50 border-indigo-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-600 text-white rounded-lg"><TrendingUp size={20} /></div>
                    <span className="font-bold text-indigo-900">Industry Score</span>
                  </div>
                  <div className="text-4xl font-extrabold text-indigo-600">{curriculum.industry_score}%</div>
                  <p className="text-xs text-indigo-700 mt-2">Alignment with current market trends</p>
                </Card>
                <Card className="p-6 bg-emerald-50 border-emerald-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-emerald-600 text-white rounded-lg"><CheckCircle2 size={20} /></div>
                    <span className="font-bold text-emerald-900">Total Credits</span>
                  </div>
                  <div className="text-4xl font-extrabold text-emerald-600">{curriculum.total_credits}</div>
                  <p className="text-xs text-emerald-700 mt-2">Strictly maintained 160 credits</p>
                </Card>
                <Card className="p-6 bg-amber-50 border-amber-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-amber-600 text-white rounded-lg"><BookOpen size={20} /></div>
                    <span className="font-bold text-amber-900">Non-Credit</span>
                  </div>
                  <div className="text-lg font-bold text-amber-600 truncate">{curriculum.non_credit_subject}</div>
                  <p className="text-xs text-amber-700 mt-2">Mandatory value-added subject</p>
                </Card>
                <Card className="p-6 bg-slate-100 border-slate-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-slate-600 text-white rounded-lg"><Layout size={20} /></div>
                    <span className="font-bold text-slate-900">Semesters</span>
                  </div>
                  <div className="text-4xl font-extrabold text-slate-600">8</div>
                  <p className="text-xs text-slate-700 mt-2">Structured academic progression</p>
                </Card>
              </div>

              {/* Skill Mapping */}
              <Card className="p-8">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <Cpu size={20} className="text-indigo-600" /> Skill-to-Subject Mapping
                </h3>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(curriculum.skill_mapping || {}).map(([skill, subjects]) => (
                    <div key={skill} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex-1 min-w-[200px]">
                      <div className="text-sm font-bold text-indigo-600 mb-2 uppercase tracking-wider">{skill}</div>
                      <div className="flex flex-wrap gap-2">
                        {subjects.map(s => (
                          <span key={s} className="px-2 py-1 bg-white border border-slate-200 rounded-md text-xs font-medium text-slate-700">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Curriculum Table */}
              <div className="space-y-12">
                {curriculum.semesters.map((sem, semIdx) => (
                  <div key={sem.semester} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-slate-800">Semester {sem.semester}</h3>
                      <div className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-bold",
                        sem.total_credits === 20 ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      )}>
                        {sem.total_credits} / 20 Credits
                      </div>
                    </div>
                    <Card className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject Name</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Credits</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Lab</th>
                            {isEditing && <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                          {sem.subjects.map((sub, subIdx) => (
                            <tr 
                              key={subIdx} 
                              className={cn(
                                "hover:bg-slate-50/50 transition-colors",
                                !isEditing && "cursor-pointer"
                              )}
                              onClick={() => !isEditing && setSelectedSubject(sub)}
                            >
                              <td className="px-6 py-4">
                                {isEditing ? (
                                  <input 
                                    className="w-20 px-2 py-1 border rounded" 
                                    value={sub.code} 
                                    onChange={e => handleEditSubject(semIdx, subIdx, 'code', e.target.value)}
                                  />
                                ) : (
                                  <span className="font-mono text-sm font-bold text-indigo-600">{sub.code}</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {isEditing ? (
                                  <input 
                                    className="w-full px-2 py-1 border rounded" 
                                    value={sub.name} 
                                    onChange={e => handleEditSubject(semIdx, subIdx, 'name', e.target.value)}
                                  />
                                ) : (
                                  <span className="font-medium">{sub.name}</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {isEditing ? (
                                  <input 
                                    type="number"
                                    className="w-16 px-2 py-1 border rounded" 
                                    value={sub.credits} 
                                    onChange={e => handleEditSubject(semIdx, subIdx, 'credits', e.target.value)}
                                  />
                                ) : (
                                  <span className="font-bold">{sub.credits}</span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {isEditing ? (
                                  <select 
                                    className="px-2 py-1 border rounded" 
                                    value={sub.type} 
                                    onChange={e => handleEditSubject(semIdx, subIdx, 'type', e.target.value)}
                                  >
                                    {['Core', 'Adaptive', 'Emerging', 'Elective', 'Non-Credit'].map(t => <option key={t} value={t}>{t}</option>)}
                                  </select>
                                ) : (
                                  <span className={cn(
                                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                                    sub.type === 'Core' ? "bg-blue-100 text-blue-700" :
                                    sub.type === 'Adaptive' ? "bg-emerald-100 text-emerald-700" :
                                    sub.type === 'Emerging' ? "bg-purple-100 text-purple-700" :
                                    "bg-slate-100 text-slate-700"
                                  )}>
                                    {sub.type}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                {isEditing ? (
                                  <input 
                                    type="checkbox" 
                                    checked={sub.lab_required} 
                                    onChange={e => handleEditSubject(semIdx, subIdx, 'lab_required', e.target.checked)}
                                  />
                                ) : (
                                  sub.lab_required ? <CheckCircle2 size={16} className="text-emerald-500" /> : <X size={16} className="text-slate-300" />
                                )}
                              </td>
                              {isEditing && (
                                <td className="px-6 py-4">
                                  <button onClick={() => removeSubject(semIdx, subIdx)} className="text-red-500 hover:text-red-700">
                                    <Trash2 size={18} />
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))}
                          {isEditing && (
                            <tr>
                              <td colSpan={6} className="px-6 py-4">
                                <button 
                                  onClick={() => addSubject(semIdx)}
                                  className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all flex items-center justify-center gap-2"
                                >
                                  <Plus size={18} /> Add Subject
                                </button>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </Card>
                  </div>
                ))}
              </div>

              {/* OBE Mapping for Institutions */}
              {curriculum.obe_mapping && (
                <Card className="p-8 space-y-6 bg-slate-900 text-white">
                  <h3 className="text-2xl font-bold flex items-center gap-2">
                    <Shield size={24} className="text-indigo-400" /> OBE & Accreditation Mapping
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="text-indigo-400 font-bold uppercase tracking-widest text-xs">Course Outcomes (CO)</div>
                      <p className="text-slate-300 text-sm leading-relaxed">{curriculum.obe_mapping.CO}</p>
                    </div>
                    <div className="space-y-4">
                      <div className="text-indigo-400 font-bold uppercase tracking-widest text-xs">Program Outcomes (PO)</div>
                      <p className="text-slate-300 text-sm leading-relaxed">{curriculum.obe_mapping.PO}</p>
                    </div>
                    <div className="col-span-full space-y-4 pt-4 border-t border-slate-800">
                      <div className="text-indigo-400 font-bold uppercase tracking-widest text-xs">Mapping Logic</div>
                      <p className="text-slate-300 text-sm leading-relaxed italic">"{curriculum.obe_mapping.mapping}"</p>
                    </div>
                  </div>
                </Card>
              )}
            </motion.div>
          )}

          {/* Trends View */}
          {view === 'trends' && trends && (
            <motion.div 
              key="trends"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold">Industry Trends Dashboard</h2>
                <p className="text-slate-600">Real-time analysis of global technology adoption and job market demand.</p>
              </div>

              {/* Trend Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-indigo-600" /> Technology Growth (2018-2024)
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={trends.growthData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="year" />
                        <YAxis />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke="#4f46e5" 
                          strokeWidth={4} 
                          dot={{ r: 6, fill: '#4f46e5' }} 
                          activeDot={{ r: 8 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-8">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <PieChartIcon size={20} className="text-emerald-600" /> Market Distribution
                  </h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Stable', value: 45 },
                            { name: 'Growing', value: 35 },
                            { name: 'Emerging', value: 20 },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          <Cell fill="#4f46e5" />
                          <Cell fill="#10b981" />
                          <Cell fill="#f59e0b" />
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>

              {/* Tech Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-600" /> Stable
                  </h3>
                  {trends.stable.map(tech => (
                    <Card key={tech} className="p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg">{tech}</span>
                        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">90%+ Adoption</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-indigo-600 h-full" style={{ width: '95%' }} />
                      </div>
                    </Card>
                  ))}
                </div>
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-600" /> Growing
                  </h3>
                  {trends.growing.map(tech => (
                    <Card key={tech} className="p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg">{tech}</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">High Growth</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-600 h-full" style={{ width: '75%' }} />
                      </div>
                    </Card>
                  ))}
                </div>
                <div className="space-y-6">
                  <h3 className="text-lg font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-600" /> Emerging
                  </h3>
                  {trends.emerging.map(tech => (
                    <Card key={tech} className="p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-lg">{tech}</span>
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">Next Gen</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-600 h-full" style={{ width: '40%' }} />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Detailed Stats Table */}
              <Card className="overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="px-8 py-4 font-bold text-slate-600">Technology</th>
                      <th className="px-8 py-4 font-bold text-slate-600">Adoption %</th>
                      <th className="px-8 py-4 font-bold text-slate-600">Market Demand</th>
                      <th className="px-8 py-4 font-bold text-slate-600">Learning Curve</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {trends.stats.map(stat => (
                      <tr key={stat.name} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-4 font-bold">{stat.name}</td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-indigo-600 h-full" style={{ width: `${stat.adoption}%` }} />
                            </div>
                            <span className="text-sm font-medium">{stat.adoption}%</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-emerald-100 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-600 h-full" style={{ width: `${stat.demand}%` }} />
                            </div>
                            <span className="text-sm font-medium">{stat.demand}%</span>
                          </div>
                        </td>
                        <td className="px-8 py-4">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                            stat.curve === 'Easy' ? "bg-emerald-100 text-emerald-700" :
                            stat.curve === 'Medium' ? "bg-amber-100 text-amber-700" :
                            "bg-red-100 text-red-700"
                          )}>
                            {stat.curve}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subject Detail Modal */}
        <AnimatePresence>
          {selectedSubject && (
            <SubjectModal 
              subject={selectedSubject} 
              onClose={() => setSelectedSubject(null)} 
            />
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-12 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
                <BookOpen size={18} />
              </div>
              <span className="text-lg font-bold tracking-tight">CurricuForge</span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Empowering institutions and students with AI-driven curriculum design.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li><button onClick={() => setView('generate')} className="hover:text-indigo-600">Generate Curriculum</button></li>
              <li><button onClick={() => setView('trends')} className="hover:text-indigo-600">Industry Trends</button></li>
              <li><button className="hover:text-indigo-600">Accreditation Mode</button></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-indigo-600">Documentation</a></li>
              <li><a href="#" className="hover:text-indigo-600">API Reference</a></li>
              <li><a href="#" className="hover:text-indigo-600">Case Studies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-2 text-slate-500 text-sm">
              <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-600">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-600">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-100 text-center text-slate-400 text-xs">
          © 2024 CurricuForge. All rights reserved. Built with Gemini AI.
        </div>
      </footer>
    </div>
  );
}
