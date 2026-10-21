import type { NoteSegment } from '../data/projects'

interface Props {
  segments: NoteSegment[]
}

export default function ProjectNote({ segments }: Props) {
  return (
    <p className="project-note">
      {segments.map((segment, i) => {
        switch (segment.type) {
          case 'strong':
            return <strong key={i}>{segment.value}</strong>
          case 'link':
            return (
              <a key={i} href={segment.href} target="_blank" rel="noopener noreferrer">
                {segment.value}
              </a>
            )
          default:
            return segment.value
        }
      })}
    </p>
  )
}
