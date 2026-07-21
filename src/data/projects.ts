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
    title: 'Project Name',
    description:
      'This is a placeholder description. You will update this with your own project details. It should describe what the project does, the problem it solves, and any interesting technical details.',
    tags: ['React', 'TypeScript', 'Node.js'],
    imageUrl: undefined,
    liveUrl: '#!',
    sourceUrl: '#!',
  },
  {
    title: 'Project Name',
    description:
      'This is another placeholder description. Swap in your own screenshots, descriptions, and links. Keep the alternating layout — images and text swap sides on every other row.',
    tags: ['Python', 'Django', 'PostgreSQL'],
    imageUrl: '/assets/project-placeholder.jpg',
    sourceUrl: '#!',
    liveUrl: '#!',
    reverse: true,
  },
  {
    title: 'Project Name',
    description:
      'Third placeholder project card. Add your own content here. The cards use a clean box-shadow hover effect and fade-in scroll animation.',
    tags: ['Vue', 'Firebase', 'Sass'],
    imageUrl: '/assets/project-placeholder.jpg',
    sourceUrl: '#!',
    liveUrl: '#!',
  },
]
