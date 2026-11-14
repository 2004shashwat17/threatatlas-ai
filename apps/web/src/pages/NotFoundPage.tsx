import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
export default function NotFoundPage() {
  return (
    <div className="not-found">
      <Compass size={48} />
      <span className="eyebrow">404 · OUTSIDE THE PERIMETER</span>
      <h1>This page isn't on the map.</h1>
      <p>The page may have moved, or the address might be incorrect.</p>
      <Button asChild>
        <Link to="/">Return to overview</Link>
      </Button>
    </div>
  )
}
