import { ArrowUpRight, Layers3, Radar, ShieldAlert, Target, Zap } from 'lucide-react'
import { stats } from '../../mocks/data'

const icons = { radar: Radar, shield: ShieldAlert, target: Target, layers: Layers3, zap: Zap }
export function StatCards() {
  return (
    <div className="stats-grid">
      {stats.map((stat) => {
        const Icon = icons[stat.icon]
        return (
          <article className={`stat-card stat-${stat.color}`} key={stat.label}>
            <div className="stat-top">
              <span>{stat.label}</span>
              <Icon size={16} />
            </div>
            <div className="stat-value-row">
              <strong>{stat.value}</strong>
              <svg
                className="sparkline"
                viewBox="0 0 90 40"
                aria-label={`${stat.label} demonstration upward trend`}
                role="img"
              >
                <path
                  d={`M ${stat.trend.map((n, i) => `${i * 10},${45 - n}`).join(' L ')}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="stat-comparison">
              <span>
                <ArrowUpRight size={12} />
                {stat.change}
              </span>
              <small>{stat.comparison}</small>
            </div>
          </article>
        )
      })}
    </div>
  )
}
