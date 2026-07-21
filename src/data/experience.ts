export interface Experience {
  role: string
  organization: string
  period: string
  description: string
}

export const experiences: Experience[] = [
  {
    role: 'Teaching Assistant',
    organization: 'University of Houston — Clear Lake',
    period: 'Sep 2017 — Dec 2017',
    description: 'TA for Introduction to AI and Advanced Operating Systems under Dr. Abukmail.',
  },
  {
    role: 'Research Assistant / Student System Administrator',
    organization: 'University of Houston — Clear Lake',
    period: 'Jun 2016 — Aug 2017',
    description: 'Managed faculty/student accounts, course data hosting, and real-time support across Windows Server 2012, IIS 6/7, Solaris 10, and Ubuntu systems.',
  },
]

export interface Education {
  degree: string
  school: string
  period: string
}

export const education: Education[] = [
  { degree: 'MS, Data Analytics', school: 'McDaniel College', period: '2023 — 2025' },
  { degree: 'MS, Computer Science', school: 'University of Houston — Clear Lake', period: '2016 — 2017' },
  { degree: 'BTech, Information and Communication Technology', school: 'DA-IICT, India', period: '2009 — 2015' },
]

export interface Skill {
  name: string
  level: number
}

export const skills: Skill[] = [
  { name: 'Python', level: 95 },
  { name: 'C# / ASP.NET Core', level: 90 },
  { name: 'JavaScript / TypeScript / React', level: 85 },
  { name: 'SQL / PostgreSQL', level: 85 },
  { name: 'Docker / Docker Compose', level: 80 },
  { name: 'Java', level: 70 },
]
