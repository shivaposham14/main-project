import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  app.get("/api/industry-trends", async (req, res) => {
    // Mocking trends for speed, but could be AI generated
    const trends = {
      stable: ["Python", "AWS", "React", "PostgreSQL"],
      growing: ["Kubernetes", "TensorFlow", "Flutter", "LangChain"],
      emerging: ["Rust", "Web3", "Edge Computing", "Quantum Computing"],
      stats: [
        { name: "Python", adoption: 95, demand: 98, curve: "Easy" },
        { name: "AWS", adoption: 88, demand: 92, curve: "Medium" },
        { name: "React", adoption: 90, demand: 85, curve: "Medium" },
        { name: "Kubernetes", adoption: 65, demand: 80, curve: "Hard" },
        { name: "TensorFlow", adoption: 60, demand: 75, curve: "Hard" },
        { name: "Rust", adoption: 30, demand: 55, curve: "Hard" },
      ],
      growthData: [
        { year: "2018", value: 40 },
        { year: "2019", value: 45 },
        { year: "2020", value: 55 },
        { year: "2021", value: 70 },
        { year: "2022", value: 85 },
        { year: "2023", value: 92 },
        { year: "2024", value: 98 },
      ]
    };
    res.json(trends);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
