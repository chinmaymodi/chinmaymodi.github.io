export interface Project {
  title: string
  description: string
  tags: string[]
  imageUrl?: string
  liveUrl: string
  sourceUrl: string
  reverse?: boolean
}

export const projects: Project[] = [
  {
    title: 'Chinmay Modi Portfolio',
    description:
      'Responsive portfolio site built with React, TypeScript, and Framer Motion. Deployed via GitHub Pages with automated CI/CD. Features scroll-triggered animations, project showcase, and resume download.',
    tags: ['React', 'TypeScript', 'Framer Motion'],
    imageUrl: undefined,
    liveUrl: 'https://chinmaymodi.github.io',
    sourceUrl: 'https://github.com/chinmaymodi/chinmaymodi.github.io',
  },
]
