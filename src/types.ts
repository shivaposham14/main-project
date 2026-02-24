export interface Subject {
  code: string;
  name: string;
  credits: number;
  type: 'Core' | 'Adaptive' | 'Emerging' | 'Elective' | 'Non-Credit';
  lab_required: boolean;
  hoursPerWeek: number;
  learningOutcomes: string[];
  courseOutcomes: string[];
  units: {
    unitNumber: number;
    title: string;
    topics: string[];
  }[];
}

export interface Semester {
  semester: number;
  total_credits: number;
  subjects: Subject[];
}

export interface Curriculum {
  degree: string;
  branch: string;
  specialization: string;
  semesters: Semester[];
  total_credits: 160;
  non_credit_subject: string;
  industry_score: number;
  skill_mapping: Record<string, string[]>;
  recommendations: string[];
  obe_mapping?: {
    CO: string;
    PO: string;
    mapping: string;
  };
  co_po_mapping?: {
    CO: string;
    PO1: number;
    PO2: number;
    PO3: number;
    PO4: number;
    PO5: number;
    PO6: number;
    PO7: number;
    PO8: number;
    PO9: number;
    PO10: number;
    PO11: number;
    PO12: number;
  }[];
}

export interface IndustryTrend {
  stable: string[];
  growing: string[];
  emerging: string[];
  stats: {
    name: string;
    adoption: number;
    demand: number;
    curve: string;
  }[];
  growthData: {
    year: string;
    value: number;
  }[];
}
