import { useId, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { activity } from '../../mocks/data'
import { useAppStore } from '../../stores/useAppStore'
import { SectionHeading } from '../ui/primitives'
import type { TimeRange } from '../../types'
import { useAnimationPreference } from '../../hooks/useAnimationPreference'

const series = [
  { key: 'total', label: 'All indicators', color: '#41cbbb' },
  { key: 'critical', label: 'Critical', color: '#ee7985' },
  { key: 'high', label: 'High', color: '#e6ab62' },
  { key: 'medium', label: 'Medium', color: '#729dee' },
]
export function ThreatActivityChart() {
  const { timeRange, setTimeRange } = useAppStore()
  const [hidden, setHidden] = useState<string[]>([])
  const id = useId().replaceAll(':', '')
  const { animate } = useAnimationPreference()
  return (
    <section className="panel activity-panel">
      <SectionHeading
        title="Threat activity"
        description="Indicator volume across the selected period"
        action={
          <div className="segmented-control">
            {(['24h', '7d', '30d'] as TimeRange[]).map((range) => (
              <button
                className={timeRange === range ? 'selected' : ''}
                key={range}
                onClick={() => setTimeRange(range)}
              >
                {range}
              </button>
            ))}
          </div>
        }
      />
      <div className="chart-legend">
        {series.map((item) => (
          <button
            key={item.key}
            aria-pressed={!hidden.includes(item.key)}
            className={hidden.includes(item.key) ? 'legend-disabled' : ''}
            onClick={() =>
              setHidden((previous) =>
                previous.includes(item.key)
                  ? previous.filter((key) => key !== item.key)
                  : [...previous, item.key],
              )
            }
          >
            <span style={{ background: item.color }} />
            {item.label}
          </button>
        ))}
        <span className="chart-demo">ILLUSTRATIVE VOLUME</span>
      </div>
      <div className="activity-chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={activity[timeRange]}
            margin={{ top: 12, right: 7, bottom: 0, left: -20 }}
          >
            <defs>
              {series.map((item) => (
                <linearGradient id={`${id}-${item.key}`} key={item.key} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor={item.color}
                    stopOpacity={item.key === 'total' ? 0.18 : 0.06}
                  />
                  <stop offset="100%" stopColor={item.color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid stroke="#202a38" strokeDasharray="3 5" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#778499', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              minTickGap={45}
              dy={9}
            />
            <YAxis
              tick={{ fill: '#778499', fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => (value >= 1000 ? `${value / 1000}k` : String(value))}
            />
            <Tooltip
              contentStyle={{
                background: '#121c2b',
                border: '1px solid #293547',
                borderRadius: 8,
                fontSize: 12,
              }}
              labelStyle={{ color: '#b3c0d0' }}
            />
            {series.map((item) => (
              <Area
                key={item.key}
                type="monotone"
                dataKey={item.key}
                name={item.label}
                stroke={item.color}
                strokeWidth={1.8}
                fill={`url(#${id}-${item.key})`}
                hide={hidden.includes(item.key)}
                isAnimationActive={animate}
                animationDuration={500}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
