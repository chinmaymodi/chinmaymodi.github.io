export interface ExperienceItem {
  role: string
  company: string
  period: string
  description: string
}

export const experiences: ExperienceItem[] = [
  {
    role: 'Software Developer II',
    company: 'SMS Assist LLC — Chicago',
    period: 'Feb 2022 — Nov 2022',
    description:
      'Designed and implemented C#/.NET microservices from a legacy monolith, improving modularity and release stability. Resolved high-volume query latency via LINQ refactoring, PostgreSQL indexing, and Redis caching. Deployed with Jenkins, enforced SonarQube quality gates, expanded CI test coverage, and supported production on-call using SumoLogic.',
  },
  {
    role: 'Software Developer',
    company: 'Ab Ovo North America — Boston',
    period: 'Apr 2019 — Jan 2022',
    description:
      'Core developer on multi-year enterprise rail cargo planning for a major Canadian client; evolved to hybrid Technical Consultant and code owner. Built internal data APIs, integrated third-party REST services, authored communication framework docs, and built a load/performance testing framework from scratch.',
  },
  {
    role: 'Student System Administrator',
    company: 'University of Houston-Clear Lake — Houston',
    period: 'Jun 2016 — Aug 2017',
    description:
      'Maintained university-hosted platforms, databases, LDAP authentication, and NFS access controls. Assisted in RAID crash recovery, restoring systems from backups and supporting database recovery procedures.',
  },
]
