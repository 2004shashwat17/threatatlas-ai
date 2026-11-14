import { useSearchParams } from 'react-router-dom'
import { PageHeading } from '../components/ui/primitives'
import { RecentThreatTable } from '../components/tables/RecentThreatTable'
export default function IntelligencePage() {
  const [params] = useSearchParams()
  return (
    <>
      <PageHeading
        title="Signals worth investigating."
        description="Search, filter, and contextualize your indicators of compromise."
      />
      <RecentThreatTable key={params.get('q')} full initialSearch={params.get('q') ?? ''} />
      <div className="notice">
        All addresses use documentation ranges; domains use .example. Aggregate overview metrics are
        illustrative and independent of these sample records. Expand the global time range to see
        older records.
      </div>
    </>
  )
}
