export interface Certification {
  title: string;
  issuer: string;
  year: string;
  category: string;
}

export const CERTIFICATIONS: Certification[] = [
  { title: "Using AI as Your SEO Assistant", issuer: "LinkedIn", year: "2024", category: "SEO" },
  { title: "On-Page and Technical SEO: SEMRush Deep Dive", issuer: "SEMrush", year: "2024", category: "SEO" },
  { title: "Backlink Management Course", issuer: "SEMrush", year: "2024", category: "SEO" },
  { title: "Programming Foundations: Object-Oriented Design", issuer: "LinkedIn", year: "2024", category: "Programming" },
  { title: "Learning Python", issuer: "LinkedIn", year: "2024", category: "Programming" },
  { title: "Programming with AI - Mini Course", issuer: "TCM Security", year: "2024", category: "Security" },
  { title: "Google IT Support Certificate", issuer: "Coursera", year: "2022", category: "Security" },
  { title: "Dante Level 3 Certification", issuer: "Audinate", year: "2022", category: "AV/Audio" },
  { title: "Dante Level 2 Certification", issuer: "Audinate", year: "2022", category: "AV/Audio" },
  { title: "Dante Level 1 Certification", issuer: "Audinate", year: "2022", category: "AV/Audio" },
  { title: "Photoshop: Texturing & Shading Techniques", issuer: "LinkedIn", year: "2022", category: "Design" },
  { title: "Photoshop: Smart Objects", issuer: "LinkedIn", year: "2022", category: "Design" },
  { title: "Listen to Lead", issuer: "LinkedIn", year: "2022", category: "Leadership" },
  { title: "Be the Manager People Won't Leave", issuer: "LinkedIn", year: "2022", category: "Leadership" },
  { title: "Google Drive Essential Training", issuer: "LinkedIn", year: "2022", category: "Productivity" },
  { title: "Google Calendar Essential Training", issuer: "LinkedIn", year: "2022", category: "Productivity" },
  { title: "Learning Airtable", issuer: "LinkedIn", year: "2021", category: "Productivity" },
  { title: "Learning Gantt Charts", issuer: "LinkedIn", year: "2021", category: "Productivity" },
  { title: "Python 101 for Hackers", issuer: "TCM Security", year: "2020", category: "Security" },
];

export const CERT_CATEGORIES = [...new Set(CERTIFICATIONS.map((c) => c.category))];
