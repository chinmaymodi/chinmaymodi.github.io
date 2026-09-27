import { timeline } from '../data/experience'

export default function TimelineSection() {
  return (
    <section id="timeline" className="content-section">
      <h2 className="section-heading">Timeline</h2>
      
      <div className="timeline-list">
        {timeline.map((item, i) => (
          <div className="timeline-card" key={i}>
            <div className="timeline-period">{item.period}</div>
            <div className="timeline-details">
              <h3 className="timeline-role">
                {item.role} <span className="timeline-company">&middot; {item.company}</span>
              </h3>
              <p className="timeline-desc">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
