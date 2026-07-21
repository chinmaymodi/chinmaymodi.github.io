export interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  highlights?: string[]
  links?: { label: string; url: string }[]
  public: boolean
  year?: string
}

export const projects: Project[] = [
  {
    id: 'void-capital',
    title: 'Void Capital',
    description: 'Full-stack NSE stock market portfolio simulator with ML-driven signal generation. React/TypeScript frontend, C# ASP.NET Core 9 backend, Python ML pipeline with event-driven backtesting and risk analytics.',
    tech: ['React', 'TypeScript', 'C#', 'ASP.NET Core 9', 'Python', 'PostgreSQL', 'Redis', 'Docker'],
    highlights: [
      'Three-portfolio engine (Manual, System, System-Reckless) with margin/leverage simulation',
      'Walk-forward backtesting with Sharpe ratio gating for live signal qualification',
      'Event-driven backtest engine with pluggable slippage and commission models',
      'Alpha factor library: momentum, volatility, volume, and correlation factors',
    ],
    links: [{ label: 'github', url: 'https://github.com/chinmaymodi?tab=repositories' }],
    public: true,
    year: '2026',
  },
  {
    id: 'trace-ace',
    title: 'Trace the Ace — ML Competition',
    description: 'Competing in a Kaggle-style EDM competition predicting student response correctness. Hyperparameter optimization, config ensemble strategies, and feature engineering on non-temporal data.',
    tech: ['Python', 'scikit-learn', 'pandas', 'numpy'],
    public: false,
    year: '2026',
  },
  {
    id: 'home-base',
    title: 'Home Base',
    description: 'Centralized workspace management system for game jams, writing, and software projects. Custom agent-kit system with project memory, skill definitions, and automated workflows.',
    tech: ['Python', 'TypeScript', 'Godot', 'C#'],
    public: false,
    year: '2026',
  },
  {
    id: 'vergil-loans',
    title: "Vergil's EduLoans",
    description: 'Fully functional loan management website with user authentication, session state, and database-driven workflows.',
    tech: ['C#', 'ASP.NET', 'MySQL', 'HTML', 'CSS'],
    links: [{ label: 'github', url: 'https://github.com/chinmaymodi/Vergil-s-EduLoans' }],
    public: true,
  },
  {
    id: 'twitter-mining',
    title: 'Twitter Data Mining on Election Data',
    description: 'Streaming Twitter data capture with sentiment analysis and candidate tracking. Used during the 2016 US Presidential Election.',
    tech: ['Python', 'Twitter API', 'MySQL'],
    links: [{ label: 'github', url: 'https://github.com/chinmaymodi/Twitter-Data-Mining-Project' }],
    public: true,
  },
  {
    id: 'tsp-btp',
    title: 'Traveling Salesman Problem — BTP',
    description: 'Benchmarked multiple TSP algorithms and heuristics across varied datasets as a Bachelor\'s Thesis Project.',
    tech: ['Python', 'Algorithms'],
    links: [{ label: 'github', url: 'https://github.com/chinmaymodi/TSP-Algorithms---BTP-Project' }],
    public: true,
  },
  {
    id: 'angry-birds',
    title: 'AI Bot for Angry Birds',
    description: 'AI agent that plays the Chrome version of Angry Birds using Java, with game state analysis and shot trajectory planning.',
    tech: ['Java', 'AI'],
    links: [{ label: 'github', url: 'https://github.com/chinmaymodi/angrybirds_vergil' }],
    public: true,
  },
]
