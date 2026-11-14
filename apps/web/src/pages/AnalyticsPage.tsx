import { Download } from 'lucide-react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { PageHeading, SectionHeading } from '../components/ui/primitives'
import { Button } from '../components/ui/button'
import { ThreatActivityChart } from '../components/charts/ThreatActivityChart'
import { ThreatDistributionChart } from '../components/charts/ThreatDistributionChart'
import { StatCards } from '../components/dashboard/StatCard'
import {
  regions,
  severityColors,
  activity,
  distribution,
  sourceData,
  severityData,
} from '../mocks/data'
import { downloadJSON } from '../utils/export'
import { useAppStore } from '../stores/useAppStore'
import { useAnimationPreference } from '../hooks/useAnimationPreference'

export default function AnalyticsPage() {
  const timeRange = useAppStore((state) => state.timeRange)
  const { animate } = useAnimationPreference()
  return (
    <>
      <PageHeading
        title="Turn signals into perspective."
        description="Understand emerging patterns across your intelligence landscape."
        actions={
          <Button
            variant="outline"
            onClick={() =>
              downloadJSON('threatatlas-demo-analytics.json', {
                timeRange,
                activity: activity[timeRange],
                distribution,
                regions,
                sourceData,
                severityData,
              })
            }
          >
            <Download size={14} />
            Export report
          </Button>
        }
      />
      <div className="notice">
        All volumes, trends, regional shares, and source contributions are illustrative, not live
        measurements. The activity chart follows the selected period; distribution snapshots are
        fixed examples.
      </div>
      <StatCards />
      <div className="dashboard-chart-grid">
        <ThreatActivityChart />
        <ThreatDistributionChart />
      </div>
      <div className="analytics-grid">
        <section className="panel">
          <SectionHeading
            title="Geographic distribution"
            description="Approximate country-level grouping · illustrative"
          />
          <div className="geographic-list">
            {regions.map((region, index) => (
              <div key={region.name}>
                <span className="region-index">0{index + 1}</span>
                <div>
                  <div className="region-label">
                    <strong>{region.name}</strong>
                    <span>{region.count} indicators</span>
                  </div>
                  <div className="progress-track">
                    <span style={{ width: `${region.value * 2}%`, background: region.color }} />
                  </div>
                </div>
                <strong>{region.value}%</strong>
              </div>
            ))}
          </div>
        </section>
        <section className="panel">
          <SectionHeading
            title="Source contribution"
            description="Illustrative aggregate indicator volume"
          />
          <div className="bar-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} layout="vertical" margin={{ left: 18, right: 24 }}>
                <CartesianGrid stroke="#202a38" strokeDasharray="3 5" horizontal={false} />
                <XAxis
                  type="number"
                  tick={{ fill: '#778499', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={95}
                  tick={{ fill: '#a3b0c1', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#121c2b',
                    border: '1px solid #293547',
                    borderRadius: 8,
                    color: '#e1e9f4',
                    fontSize: 12,
                  }}
                  cursor={{ fill: '#1a2636' }}
                />
                <Bar
                  dataKey="value"
                  name="Indicators"
                  fill="#49bdb2"
                  radius={[0, 4, 4, 0]}
                  barSize={20}
                  isAnimationActive={animate}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel">
          <SectionHeading
            title="Severity distribution"
            description="Risk profile across the sample landscape"
          />
          <div className="bar-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={severityData} margin={{ left: -20, right: 20 }}>
                <CartesianGrid stroke="#202a38" strokeDasharray="3 5" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#a3b0c1', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#778499', fontSize: 10 }}
                  unit="%"
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#121c2b',
                    border: '1px solid #293547',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  cursor={{ fill: '#1a2636' }}
                />
                <Bar
                  dataKey="value"
                  name="Share %"
                  radius={[4, 4, 0, 0]}
                  barSize={36}
                  isAnimationActive={animate}
                >
                  {severityData.map((row) => (
                    <Cell
                      key={row.name}
                      fill={severityColors[row.name as keyof typeof severityColors]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </>
  )
}
