import { Download, ArrowUpRight, CalendarDays } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PageHeading } from '../components/ui/primitives'
import { Button } from '../components/ui/button'
import { StatCards } from '../components/dashboard/StatCard'
import { ThreatMap } from '../components/maps/ThreatMap'
import { AIThreatSummary, RegionalOverview } from '../components/dashboard/AIThreatSummary'
import { ThreatActivityChart } from '../components/charts/ThreatActivityChart'
import { ThreatDistributionChart } from '../components/charts/ThreatDistributionChart'
import { RecentThreatTable } from '../components/tables/RecentThreatTable'
import { downloadJSON } from '../utils/export'
import { stats, threats } from '../mocks/data'

export default function OverviewPage() {
  return (
    <>
      <PageHeading
        title="Your intelligence. In focus."
        description="A unified perspective on the threats that matter to your organization."
        actions={
          <>
            <Button
              variant="outline"
              onClick={() => downloadJSON('threatatlas-demo-overview.json', { stats, threats })}
            >
              <Download size={14} />
              Export overview
            </Button>
            <Button asChild>
              <Link to="/intelligence">
                Explore intelligence
                <ArrowUpRight size={15} />
              </Link>
            </Button>
          </>
        }
      />
      <div className="overview-context">
        <span>
          <span className="status-dot" />
          Demonstration data
          <span className="context-divider" />
          Curated intelligence workspace
        </span>
        <span>
          <CalendarDays size={12} />
          14 November 2026 <span className="muted">· 08:00 UTC fixture</span>
        </span>
      </div>
      <StatCards />
      <div className="dashboard-hero-grid">
        <ThreatMap />
        <div className="dashboard-insights">
          <AIThreatSummary />
          <RegionalOverview />
        </div>
      </div>
      <div className="dashboard-chart-grid">
        <ThreatActivityChart />
        <ThreatDistributionChart />
      </div>
      <RecentThreatTable />
    </>
  )
}
