import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { distribution } from '../../mocks/data'
import { SectionHeading } from '../ui/primitives'
import { useAnimationPreference } from '../../hooks/useAnimationPreference'

export function ThreatDistributionChart() {
  const { animate } = useAnimationPreference()
  return (
    <section className="panel distribution-panel">
      <SectionHeading
        title="Threat distribution"
        description="By indicator category · illustrative"
      />
      <div className="distribution-content">
        <div className="donut-container">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distribution}
                innerRadius="72%"
                outerRadius="92%"
                paddingAngle={4}
                dataKey="value"
                stroke="none"
                cornerRadius={3}
                isAnimationActive={animate}
                animationDuration={500}
              >
                {distribution.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#121c2b',
                  border: '1px solid #293547',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                itemStyle={{ color: '#e1e9f4' }}
                formatter={(value) => `${value}%`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="donut-label">
            <strong>6</strong>
            <span>categories</span>
          </div>
        </div>
        <div className="distribution-legend">
          {distribution.map((item) => (
            <div key={item.name}>
              <span className="legend-dot" style={{ background: item.color }} />
              <span>{item.name}</span>
              <strong>{item.value}%</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
