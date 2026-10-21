export type NoteSegment =
  | { type: 'text'; value: string }
  | { type: 'strong'; value: string }
  | { type: 'link'; value: string; href: string }

export interface Project {
  title: string
  description: string
  tags: string[]
  liveUrl?: string
  sourceUrl?: string
  liveBtnText?: string
  note?: NoteSegment[]
}

export const projects: Project[] = [
  {
    title: 'NSE Strategy Platform',
    description: 'A full-stack NSE market data and strategy platform, designed for high-frequency data ingestion and backtesting. Built as a modular monolith using C#/.NET 10 and EF Core, featuring a React/TypeScript frontend for real-time visualization, and a Python-based quantitative pipeline for strategy development, factor analysis, and risk management. Includes autonomous signal agents (SMA crossover, RSI momentum, basis, PCR, IV) that could be configured for live broker execution after further testing, plus automated daily data cycles, walk-forward backtesting, and cloud-ready infrastructure. Full test coverage: 383 C# tests (96.3% line coverage) + 555 Python tests (92.6% library coverage) = 938 automated tests. Built end-to-end with an AI-assisted engineering workflow, owning all architecture, data-validation, and acceptance decisions, backed by verification scripts that audited 5.4M+ options records for gaps and duplicates.',
    tags: ['C#', '.NET', 'React', 'TypeScript', 'Python', 'Docker', 'PostgreSQL', 'Quant', 'Backtesting', 'System Design'],
    sourceUrl: 'https://github.com/chinmaymodi/Void-Capital',
  },
  {
    title: 'Game Development',
    description: 'A collection of 6 projects built in Godot 4 (C#), focusing on high-performance systems and algorithmic challenges. Projects include complex puzzle solvers (Held-Karp TSP, minimax search), procedural generation engines (Perlin noise, distance-field collision), dynamic lighting/physics systems, and robust state machine architectures for game logic. These projects demonstrate a focus on clean C# architecture, memory management, and algorithmic optimization.',
    tags: ['Godot 4', 'C#', 'Procedural Generation', 'Algorithms', 'Optimization', 'Physics', 'Pathfinding', 'Minimax', 'Held-Karp', 'Sonar', 'Lighting', 'State Machine'],
    liveUrl: 'https://insomniargh.itch.io/',
    liveBtnText: 'Check it out on itch',
  },
  {
    title: 'BCBR Practice Test',
    description: 'A 689-question exam simulator for the NPTEL/SWAYAM Basic Course in Biomedical Research, with a 100-question timed exam mode, assignment practice, bookmarks, exam history, and dark mode. Built with plain HTML, CSS, and JavaScript, no framework.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Education', 'NPTEL'],
    liveUrl: './BCBR-Quiz/',
    liveBtnText: 'Try the quiz',
    note: [
      { type: 'text', value: 'Questions sourced from ' },
      { type: 'strong', value: 'Basic Course in Biomedical Research' },
      { type: 'text', value: ' by ICMR-National Institute of Epidemiology / SWAYAM-NPTEL. Distributed under ' },
      { type: 'link', value: 'CC BY-NC-SA 4.0', href: 'https://creativecommons.org/licenses/by-nc-sa/4.0/' },
      { type: 'text', value: '. This is an unofficial practice tool for students.' },
    ],
  },
]
