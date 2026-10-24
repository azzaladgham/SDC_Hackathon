// scripts/build-tracked-skills.ts
// Run from the scripts/ folder:  npx tsx build-tracked-skills.ts
// Looks up each ESCO URI from ../data/esco.json by skill label and writes ../data/tracked-skills.json
// Edit the keywords below freely. They are what fetch-trends.ts will search on arXiv and HN.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const ESCO = path.resolve(process.cwd(), "../data/esco.json");
const OUT = path.resolve(process.cwd(), "../data/tracked-skills.json");

const TRACKED: { label: string; keywords: string[] }[] = [
  // ICT and data
  { label: "data mining", keywords: ["data mining"] },
  { label: "query languages", keywords: ["SQL", "GraphQL", "SPARQL"] },
  { label: "data models", keywords: ["data modeling", "knowledge graph"] },
  { label: "statistics", keywords: ["statistical modeling", "Bayesian"] },
  { label: "computer programming", keywords: ["Python", "Rust", "TypeScript"] },
  { label: "web programming", keywords: ["React", "Next.js", "web development"] },
  { label: "debug software", keywords: ["automated debugging", "fault localization"] },
  { label: "design database scheme", keywords: ["PostgreSQL", "database schema"] },
  { label: "use software design patterns", keywords: ["design patterns", "microservices"] },
  { label: "analyse big data", keywords: ["big data", "Spark", "data lake"] },
  { label: "data quality assessment", keywords: ["data quality", "data observability"] },
  { label: "perform data cleansing", keywords: ["data cleaning", "ETL"] },
  { label: "information extraction", keywords: ["information extraction", "named entity recognition"] },
  { label: "tools for software configuration management", keywords: ["Git", "infrastructure as code", "Terraform"] },
  { label: "integrated development environment software", keywords: ["AI coding assistant", "Copilot", "Cursor"] },
  { label: "ICT security legislation", keywords: ["GDPR", "cybersecurity compliance"] },
  { label: "design graphics", keywords: ["generative design", "Figma"] },
  // Business and operations
  { label: "supply chain management", keywords: ["supply chain", "supply chain optimization"] },
  { label: "analyse supply chain trends", keywords: ["supply chain forecasting", "demand forecasting"] },
  { label: "perform risk analysis", keywords: ["risk analysis", "risk modelling"] },
  { label: "project management", keywords: ["project management", "agile"] },
  { label: "manage inventory", keywords: ["inventory management", "inventory optimization"] },
  { label: "perform market research", keywords: ["market research", "consumer insights"] },
  { label: "pricing strategies", keywords: ["dynamic pricing", "pricing optimization"] },
  { label: "corporate social responsibility", keywords: ["ESG", "sustainability reporting"] },
  { label: "manage budgets", keywords: ["budget forecasting", "financial planning and analysis"] },
  { label: "provide technical documentation", keywords: ["software documentation", "API documentation"] },
  { label: "train employees", keywords: ["upskilling", "corporate training"] },
  { label: "communicate with customers", keywords: ["customer support automation", "chatbot"] },
  // Finance
  { label: "analyse financial risk", keywords: ["financial risk", "credit risk"] },
  { label: "accounting", keywords: ["accounting automation", "bookkeeping automation"] },
  { label: "interpret financial statements", keywords: ["financial statement analysis", "financial reporting"] },
  { label: "tax legislation", keywords: ["tax compliance", "tax automation"] },
    // Shared services, HR, finance and business analysis (added to cover roles with no trend data)
  { label: "manage payroll", keywords: ["payroll automation", "payroll software"] },
  { label: "use microsoft office", keywords: ["Microsoft Copilot", "Microsoft 365"] },
  { label: "ensure proper document management", keywords: ["document management", "intelligent document processing"] },
  { label: "draft corporate emails", keywords: ["email automation", "AI email assistant"] },
  { label: "perform office routine activities", keywords: ["robotic process automation"] },
  { label: "manage payroll reports", keywords: ["HR analytics", "people analytics"] },
  { label: "profile people", keywords: ["talent assessment", "AI recruiting"] },
  { label: "job market offers", keywords: ["labor market", "job matching"] },
  { label: "business process modelling", keywords: ["BPMN", "process mining"] },
  { label: "analyse business requirements", keywords: ["requirements engineering", "user stories"] },
  { label: "apply change management", keywords: ["change management", "digital transformation"] },
  { label: "use accounting systems", keywords: ["accounting software", "enterprise resource planning"] },
  { label: "identify accounting errors", keywords: ["accounting fraud", "financial fraud detection"] },
  { label: "customer service", keywords: ["customer experience", "contact center"] },
];

async function main() {
  const esco = JSON.parse(await readFile(ESCO, "utf8"));
  const byLabel = new Map<string, string>();
  for (const [uri, label] of Object.entries(esco.skillLabels as Record<string, string>)) {
    byLabel.set(label.toLowerCase(), uri);
  }

  const out: { escoUri: string; label: string; keywords: string[] }[] = [];
  const missing: string[] = [];

  for (const t of TRACKED) {
    const uri = byLabel.get(t.label.toLowerCase());
    if (!uri) {
      missing.push(t.label);
      continue;
    }
    out.push({ escoUri: uri, label: esco.skillLabels[uri], keywords: t.keywords });
  }

  await writeFile(OUT, JSON.stringify(out, null, 2));
  console.log(`Wrote ${out.length} tracked skills to ${OUT}`);
  if (missing.length) console.warn(`\nNot found in esco.json (check spelling):\n- ${missing.join("\n- ")}`);
}

main();
