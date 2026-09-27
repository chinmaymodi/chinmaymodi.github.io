export interface TimelineItem {
  role: string
  company: string
  period: string
  description: string
  type: 'work' | 'education'
}

export const timeline: TimelineItem[] = [
  {
    role: 'Product Engineer',
    company: 'Personal Project',
    period: '2026 — Present',
    description:
      'Built a full-stack NSE stock market portfolio simulator for personal use. Developed a modular monolith in C#/.NET with EF Core, a React/TypeScript frontend, and a Python-based quant pipeline for backtesting and risk analysis.',
    type: 'work',
  },
  {
    role: 'M.S. Data Analytics',
    company: 'McDaniel College',
    period: '2025',
    description:
      'Advanced coursework in statistical modeling, machine learning, data visualization, and big data infrastructure. Applied analytical techniques to real-world datasets.',
    type: 'education',
  },
  {
    role: 'Software Developer II',
    company: 'SMS Assist LLC — Chicago',
    period: 'Feb 2022 — Nov 2022',
    description:
      'Designed and implemented C#/.NET microservices from a legacy monolith, improving modularity and release stability. Resolved high-volume query latency via LINQ refactoring, PostgreSQL indexing, and Redis caching. Deployed with Jenkins, enforced SonarQube quality gates, expanded CI test coverage, and supported production on-call using SumoLogic.',
    type: 'work',
  },
  {
    role: 'Software Developer',
    company: 'Ab Ovo North America — Boston',
    period: 'Apr 2019 — Jan 2022',
    description:
      'Core developer on multi-year enterprise rail cargo planning for a major Canadian client; evolved to hybrid Technical Consultant and code owner. Built internal data APIs, integrated third-party REST services, authored communication framework docs, and built a load/performance testing framework from scratch.',
    type: 'work',
  },
  {
    role: 'M.S. Computer Science',
    company: 'University of Houston-Clear Lake',
    period: '2017',
    description:
      'Graduate studies in advanced algorithms, distributed systems, database internals, and software engineering methodology.',
    type: 'education',
  },
  {
    role: 'B.Tech Information & Communication Technology',
    company: 'DA-IICT — Gujarat, India',
    period: '2015',
    description:
      'Bachelor\'s program covering computer science fundamentals, communication networks, signal processing, and software development. Graduated with a foundation in both hardware and software systems.',
    type: 'education',
  },
]
