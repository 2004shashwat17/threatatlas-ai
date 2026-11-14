import { useMemo, useState, type ReactNode } from 'react'
import { filterThreats, threats, type Severity } from './data'
import './App.css'

const navigation = [
  { label: 'Overview', icon: 'grid', target: '#overview' },
  { label: 'Threat feed', icon: 'pulse', target: '#threat-feed', count: '24' },
  { label: 'Entities', icon: 'nodes', target: '#entities' },
  { label: 'Reports', icon: 'file', target: '#insights' },
]

const activity = [
  { day: 'MON', value: 42 },
  { day: 'TUE', value: 64 },
  { day: 'WED', value: 51 },
  { day: 'THU', value: 78 },
  { day: 'FRI', value: 58 },
  { day: 'SAT', value: 88 },
  { day: 'SUN', value: 69 },
]

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const paths: Record<string, ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    pulse: <><path d="M3 12h4l3-8 4 16 3-8h4" /><path d="M3 20h18" opacity=".35" /></>,
    nodes: <><circle cx="12" cy="5" r="2.5" /><circle cx="5" cy="18" r="2.5" /><circle cx="19" cy="18" r="2.5" /><path d="m10.8 7.2-4.5 8.6m6.9-8.6 4.5 8.6M7.5 18h9" /></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M8 13h8m-8 4h8" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 5 5" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
    globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" /><path d="m9 12 2 2 4-4" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    filter: <><path d="M4 7h16M7 12h10m-7 5h4" /><circle cx="8" cy="7" r="1.5" fill="currentColor" /><circle cx="15" cy="12" r="1.5" fill="currentColor" /></>,
    dots: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
  }

  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name] ?? paths.grid}
    </svg>
  )
}

function App() {
  const [query, setQuery] = useState('')
  const [severity, setSeverity] = useState<Severity | 'all'>('all')
  const filteredThreats = useMemo(
    () => filterThreats(threats, query, severity),
    [query, severity],
  )
  const exportReport = () => {
    const report = JSON.stringify({
      exportedAt: new Date().toISOString(),
      filters: { query, severity },
      threats: filteredThreats,
    }, null, 2)
    const url = URL.createObjectURL(new Blob([report], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `threatatlas-report-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview" aria-label="ThreatAtlas home">
          <span className="brand-mark"><span /></span>
          <span>threat<span className="brand-light">atlas</span><sup>AI</sup></span>
        </a>
        <div className="workspace-label">WORKSPACE</div>
        <button className="workspace-switch" type="button">
          <span className="workspace-avatar">N</span>
          <span className="workspace-name">Northstar Security<small>Demo workspace</small></span>
          <span className="switch-chevron">⌄</span>
        </button>
        <div className="nav-label">INTELLIGENCE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navigation.map((item, index) => (
            <a key={item.label} aria-label={item.label} className={`nav-item ${index === 0 ? 'active' : ''}`} href={item.target}>
              <Icon name={item.icon} />
              <span>{item.label}</span>
              {item.count && <span className="nav-count">{item.count}</span>}
            </a>
          ))}
        </nav>
        <div className="nav-label tools-label">WORKSPACE</div>
        <a className="nav-item" aria-label="Attack surface" href="#entities"><Icon name="globe" /><span>Attack surface</span></a>
        <a className="nav-item" aria-label="Watchlists" href="#insights"><Icon name="shield" /><span>Watchlists</span></a>
        <div className="sidebar-spacer" />
        <div className="source-status">
          <span className="status-dot" />
          <div><strong>Sample data loaded</strong><small>Live feeds not connected</small></div>
          <Icon name="chevron" size={15} />
        </div>
        <button className="profile" type="button">
          <span className="profile-avatar">SC</span>
          <span className="profile-name">Sarah Chen<small>Demo analyst</small></span>
          <Icon name="dots" size={18} />
        </button>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div className="breadcrumbs"><span>Workspace</span><b>/</b><strong>Overview</strong></div>
          <div className="topbar-actions">
            <div className="global-search">
              <Icon name="search" size={16} />
              <input aria-label="Search threat intelligence" placeholder="Search anything..." value={query} onChange={(event) => setQuery(event.target.value)} />
            </div>
            <span className="date-filter"><Icon name="clock" size={15} /> Sample · 24 hours</span>
          </div>
        </header>

        <div className="page-wrap">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> SAMPLE OVERVIEW <span className="eyebrow-date">/ ILLUSTRATIVE DATA</span></div>
              <h1>Good morning, Sarah <span className="wave">✳</span></h1>
              <p className="welcome-copy">Explore a sample threat landscape. Metrics and indicators are illustrative.</p>
            </div>
            <button className="export-button" type="button" onClick={exportReport}><Icon name="file" size={16} /> Export data</button>
          </section>

          <section className="metric-grid" aria-label="Threat landscape summary">
            <article className="metric-card">
              <div className="metric-top"><span className="metric-label">ACTIVE THREATS</span><span className="metric-icon purple"><Icon name="pulse" size={17} /></span></div>
              <div className="metric-value">2,847 <span className="metric-change positive"><Icon name="arrow" size={12} /> 12.8%</span></div>
              <div className="metric-footer">vs. previous 24 hours</div>
              <div className="sparkline purple-spark"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span className="metric-label">CRITICAL EXPOSURES</span><span className="metric-icon red"><Icon name="shield" size={17} /></span></div>
              <div className="metric-value">18 <span className="metric-change negative"><Icon name="arrow" size={12} /> 4.2%</span></div>
              <div className="metric-footer">vs. previous 24 hours</div>
              <div className="sparkline red-spark"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span className="metric-label">IOCs CORRELATED</span><span className="metric-icon blue"><Icon name="nodes" size={17} /></span></div>
              <div className="metric-value">1,293 <span className="metric-change positive"><Icon name="arrow" size={12} /> 8.6%</span></div>
              <div className="metric-footer">across 94 threat clusters</div>
              <div className="sparkline blue-spark"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
            </article>
            <article className="metric-card">
              <div className="metric-top"><span className="metric-label">SOURCES MODELED</span><span className="metric-icon green"><Icon name="globe" size={17} /></span></div>
              <div className="metric-value">36 <span className="metric-unit">sources</span></div>
              <div className="metric-footer">across 12 sample feeds</div>
              <div className="source-avatars" aria-label="Open source intelligence, dark web, and commercial feeds"><span>O</span><span>D</span><span>C</span><span>+33</span></div>
            </article>
          </section>

          <section className="visual-grid">
            <article className="panel activity-panel">
              <div className="panel-heading">
                <div><div className="panel-title">Threat activity</div><div className="panel-subtitle">Illustrative activity across a sample landscape</div></div>
                <span className="select-button">Sample · 7 days</span>
              </div>
              <div className="chart-legend"><span><i className="legend-dot violet-dot" /> Threats detected</span><span><i className="legend-dot muted-dot" /> Baseline</span></div>
              <div className="chart-wrap">
                <div className="chart-y-labels"><span>600</span><span>450</span><span>300</span><span>150</span><span>0</span></div>
                <div className="chart-area">
                  <div className="chart-gridlines"><i /><i /><i /><i /><i /></div>
                  <svg className="activity-chart" viewBox="0 0 700 190" preserveAspectRatio="none" role="img" aria-label="Threat activity chart showing a rising trend over the last seven days">
                    <defs><linearGradient id="activity-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#8067f5" stopOpacity=".27" /><stop offset="100%" stopColor="#8067f5" stopOpacity="0" /></linearGradient></defs>
                    <path d="M0 148 C35 140 43 118 82 128 S126 142 164 112 S202 120 246 100 S288 111 328 84 S376 94 412 78 S458 89 494 61 S538 72 576 46 S627 57 660 30 S684 38 700 20 V190 H0Z" fill="url(#activity-fill)" />
                    <path d="M0 148 C35 140 43 118 82 128 S126 142 164 112 S202 120 246 100 S288 111 328 84 S376 94 412 78 S458 89 494 61 S538 72 576 46 S627 57 660 30 S684 38 700 20" fill="none" stroke="#8067f5" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                    <path d="M0 162 C54 152 76 162 122 149 S191 157 238 140 S289 147 338 130 S403 139 452 119 S524 131 570 109 S639 118 700 92" fill="none" stroke="#d8d5e4" strokeDasharray="4 5" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                    <circle cx="660" cy="30" r="5" fill="#8067f5" stroke="white" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                  </svg>
                  <div className="chart-x-labels">{activity.map(({ day }) => <span key={day}>{day}</span>)}</div>
                </div>
              </div>
            </article>

            <article className="panel map-panel" id="entities">
              <div className="panel-heading">
                <div><div className="panel-title">Global activity</div><div className="panel-subtitle">Sample threat origins · 24 hours</div></div>
                <span className="map-demo-label">DEMO</span>
              </div>
              <div className="world-map">
                <svg viewBox="0 0 560 250" role="img" aria-label="Schematic map with threat activity hotspots">
                  <g className="landmass">
                    <path d="m55 53 24-19 31 4 16-13 29 6 16 16-10 15 14 12-9 12-21-3-9 20-16 8-4 25-16 14-10-12-7-28-15-13-7-21-17-10 1-13Z" />
                    <path d="m145 145 22 4 16 16-5 19 14 17-11 30-12 9-9-21-14-12-2-24-11-18 12-20Z" />
                    <path d="m240 49 18-12 20 5 9 14-9 9-16-3-10 9-13-8 1-14Z" />
                    <path d="m279 77 19-16 30 4 15 15 20-5 12 9 26-9 18 12-6 15-22 8-8 14-25 3-14 16-17-8-12-18-20 1-13-14-16-1-8-14 11-12Z" />
                    <path d="m305 145 19-5 17 9 6 25-14 32-19 19-14-17 5-23-12-17 12-23Z" />
                    <path d="m414 162 24-7 16 12-4 17-17 13-22-9 3-26Z" />
                    <path d="m458 176 25 4 14 12-9 11-26-3-12-12 8-12Z" />
                  </g>
                  <g className="map-route"><path d="M115 76 Q241 6 338 81T447 179" /><path d="M162 173 Q255 221 357 101" /></g>
                  <g className="map-points">
                    <circle cx="116" cy="77" r="8" /><circle cx="116" cy="77" r="3" />
                    <circle cx="337" cy="81" r="10" /><circle cx="337" cy="81" r="4" />
                    <circle cx="410" cy="112" r="7" /><circle cx="410" cy="112" r="3" />
                    <circle cx="164" cy="172" r="6" /><circle cx="164" cy="172" r="2.5" />
                    <circle cx="445" cy="179" r="6" /><circle cx="445" cy="179" r="2.5" />
                  </g>
                </svg>
                <div className="map-label label-us">N. AMERICA <b>38%</b></div>
                <div className="map-label label-eu">EUROPE <b>27%</b></div>
                <div className="map-label label-apac">APAC <b>21%</b></div>
              </div>
              <div className="map-footer"><span><i className="legend-dot violet-dot" /> 2,847 events</span><span><i className="legend-dot red-dot" /> 18 critical</span><a href="#threat-feed">View map <Icon name="arrow" size={13} /></a></div>
            </article>
          </section>

          <section className="lower-grid">
            <article className="panel feed-panel" id="threat-feed">
              <div className="panel-heading feed-heading">
                <div><div className="panel-title">Recent threat activity <span className="feed-live">SAMPLE</span></div><div className="panel-subtitle">Example signals from illustrative intelligence sources</div></div>
                <div className="feed-controls">
                  <label className="filter-control"><Icon name="filter" size={15} /><span className="sr-only">Filter by severity</span><select value={severity} onChange={(event) => setSeverity(event.target.value as Severity | 'all')}><option value="all">All severity</option><option value="critical">Critical</option><option value="high">High</option><option value="medium">Medium</option></select><span className="select-caret">⌄</span></label>
                  <a className="text-link" href="#threat-feed">View all <Icon name="arrow" size={14} /></a>
                </div>
              </div>
              <div className="threat-table" role="table" aria-label="Recent threat activity">
                <div className="table-header" role="row"><span role="columnheader">THREAT</span><span role="columnheader">INDICATOR</span><span role="columnheader">SOURCE</span><span role="columnheader">SEVERITY</span><span role="columnheader">DETECTED</span><span role="columnheader" aria-label="Actions" /></div>
                {filteredThreats.length === 0 ? (
                  <div className="empty-state">No threats match your search. Try another keyword or severity.</div>
                ) : filteredThreats.map((threat) => (
                  <div className="threat-row" role="row" key={threat.id}>
                    <div className="threat-name" role="cell"><span className={`threat-type-icon ${threat.severity}`}><Icon name={threat.icon} size={15} /></span><span><strong>{threat.title}</strong><small>{threat.category} <span>·</span> {threat.actor}</small></span></div>
                    <div className="indicator" role="cell"><code>{threat.indicator}</code><button className="copy-button" type="button" aria-label={`Copy indicator ${threat.indicator}`} onClick={() => navigator.clipboard?.writeText(threat.indicator)}>⧉</button></div>
                    <div className="source-cell" role="cell"><span className="source-symbol">{threat.sourceMark}</span>{threat.source}</div>
                    <div role="cell"><span className={`severity-pill ${threat.severity}`}><i />{threat.severity}</span></div>
                    <div className="detected-cell" role="cell">{threat.detected}</div>
                    <span className="row-action" aria-hidden="true"><Icon name="chevron" size={16} /></span>
                  </div>
                ))}
              </div>
              <div className="table-footer"><span>Showing <strong>{filteredThreats.length}</strong> of <strong>{threats.length}</strong> recent signals <span className="sample-note">· illustrative sample data</span></span><a href="#threat-feed">Open threat feed <Icon name="arrow" size={13} /></a></div>
            </article>

            <article className="panel insight-panel" id="insights">
              <div className="panel-heading">
                <div><div className="panel-title">AI insight example</div><div className="panel-subtitle">Illustrative campaign correlation</div></div>
                <span className="ai-spark">✳</span>
              </div>
              <div className="insight-feature">
                <div className="insight-tag"><span /> EMERGING CAMPAIGN</div>
                <h3>Coordinated credential<br />harvesting campaign</h3>
                <p>12 indicators across 4 sources point to a coordinated campaign targeting SaaS login portals.</p>
                <div className="insight-meta"><span><b>●</b> 4 sources correlated</span><span>14 min ago</span></div>
              </div>
              <div className="insight-bottom">
                <div className="confidence"><span>CONFIDENCE SCORE</span><strong>94<small>%</small></strong><div className="confidence-track"><i /></div></div>
                <a className="insight-link" href="#threat-feed">Review feed <Icon name="arrow" size={14} /></a>
              </div>
              <div className="insight-note"><Icon name="shield" size={13} /> Insight is based on illustrative sample intelligence.</div>
            </article>
          </section>

          <footer className="page-footer"><span>ThreatAtlas AI <span>·</span> Intelligence that sees ahead</span><span>Live integrations are not connected</span></footer>
        </div>
      </main>
    </div>
  )
}

export default App
