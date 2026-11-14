import { BookOpen, Globe2, Keyboard, Layers3, ShieldCheck, Sparkles } from 'lucide-react'
import { PageHeading } from '../components/ui/primitives'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'

const guides = [
  {
    icon: Globe2,
    title: 'Explore the geographic view',
    content:
      'Drag the 3D globe to rotate and scroll to zoom. Select markers for indicator details. Clustered markers expand as you zoom in. Switch to 2D for a flat geographic view. Country filters navigate to the selected region.',
  },
  {
    icon: Layers3,
    title: 'Investigate an indicator',
    content:
      'Search and filter the intelligence table, then select an indicator. Details include severity, source, confidence, and fixture timestamps. Export filtered results as JSON. The global time range controls map, table, and activity-chart windows.',
  },
  {
    icon: Sparkles,
    title: 'Try the Copilot preview',
    content:
      'Ask about critical threats, the sample IP, ransomware, or related indicators. Replies are predefined mock responses, not AI-generated conclusions. No prompt is sent externally. Do not enter sensitive information.',
  },
  {
    icon: Keyboard,
    title: 'Keyboard & accessibility',
    content:
      'Press Cmd/Ctrl + K for workspace search. Use Tab to move through controls, Enter to activate, and Escape to close dialogs. Use the map indicator selector to inspect markers without a pointer. System reduced-motion preferences are respected.',
  },
  {
    icon: ShieldCheck,
    title: 'Understand the demonstration data',
    content:
      'All threat events, incidents, aggregate metrics, and vulnerability references are fictional. Source names identify intended future adapters, not real connections. Country-level coordinates are illustrative and never establish attacker identity. Fixture time is 14 November 2026, 08:00 UTC.',
  },
  {
    icon: BookOpen,
    title: 'What is saved?',
    content:
      'Sidebar, visualization, and profile preferences persist in your browser. Incident and integration demo changes last only until reload. No authentication, live telemetry, model connection, or automated security response is enabled.',
  },
]
export default function HelpPage() {
  return (
    <>
      <PageHeading
        title="Context for every question."
        description="A quick guide to your THREATATLAS AI demonstration workspace."
      />
      <div className="help-intro panel">
        <span className="help-intro-icon">
          <BookOpen size={29} />
        </span>
        <div>
          <span className="eyebrow">WORKSPACE DOCUMENTATION</span>
          <h2>Your intelligence journey starts here.</h2>
          <p>Explore the interface safely. Every signal in this workspace is fictional.</p>
        </div>
        <Button variant="outline" asChild>
          <Link to="/intelligence">Explore intelligence</Link>
        </Button>
      </div>
      <div className="help-grid">
        {guides.map(({ icon: Icon, title, content }) => (
          <article className="panel help-card" key={title}>
            <Icon size={21} />
            <h2>{title}</h2>
            <p>{content}</p>
          </article>
        ))}
      </div>
    </>
  )
}
