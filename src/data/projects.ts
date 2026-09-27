export interface Project {
  title: string
  description: string
  tags: string[]
  liveUrl?: string
  sourceUrl?: string
  liveBtnText?: string
}

export const projects: Project[] = [
  {
    title: 'Void Capital',
    description: 'A full-stack NSE stock market portfolio simulator designed for high-frequency data ingestion and backtesting. Built as a modular monolith using C#/.NET 9 and EF Core, featuring a React/TypeScript frontend for real-time visualization, and a Python-based quantitative pipeline for strategy development, factor analysis, and risk management. Includes automated daily data cycles, walk-forward backtesting, and cloud-ready infrastructure.',
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
]
