import fs from "fs";
import path from "path";
import matter from "gray-matter";

const MIGHTY_ROOT = path.resolve(process.env.HOME ?? "~", "_Code/mighty");
const OUTPUT = path.resolve(process.cwd(), "src/data/mighty-tools.json");

interface ToolEntry {
  slug: string;
  name: string;
  description: string;
  category: string;
  source: "skill" | "agent";
}

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function walkSkills(dir: string, results: ToolEntry[]): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_") || entry.name === "node_modules") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const skillFile = path.join(full, "SKILL.md");
      if (fs.existsSync(skillFile)) {
        try {
          const { data } = matter(fs.readFileSync(skillFile, "utf-8"));
          if (data.name && data.description) {
            results.push({
              slug: String(data.name),
              name: String(data.name),
              description: String(data.description).split(".")[0].trim(),
              category: path.relative(path.join(MIGHTY_ROOT, "skills"), dir).split(path.sep)[0] ?? "ops",
              source: "skill",
            });
          }
        } catch {}
      }
      walkSkills(full, results);
    }
  }
}

function walkAgents(dir: string, results: ToolEntry[]): void {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith("_") || entry.name === "node_modules" || entry.name === "archive") continue;
    const full = path.join(dir, entry.name);
    if (!entry.isDirectory()) continue;
    const manifestFile = path.join(full, "manifest.json");
    if (fs.existsSync(manifestFile)) {
      try {
        const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf-8"));
        if (manifest.name && manifest.description && manifest.status !== "archived") {
          results.push({
            slug: slugify(manifest.name),
            name: manifest.name,
            description: String(manifest.description).split(".")[0].trim(),
            category: manifest.category ?? "ops",
            source: "agent",
          });
        }
      } catch {}
    }
    walkAgents(full, results);
  }
}

const tools: ToolEntry[] = [];
walkSkills(path.join(MIGHTY_ROOT, "skills"), tools);
walkAgents(path.join(MIGHTY_ROOT, "agents"), tools);
walkAgents(path.join(MIGHTY_ROOT, "agents/tools"), tools);

const seen = new Set<string>();
const unique = tools.filter((t) => {
  if (seen.has(t.slug)) return false;
  seen.add(t.slug);
  return true;
});

fs.writeFileSync(OUTPUT, JSON.stringify(unique, null, 2));
console.log(`Wrote ${unique.length} tools to ${OUTPUT}`);
