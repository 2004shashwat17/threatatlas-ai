import {
  ChevronDown,
  ChevronsLeft,
  ChevronsRight,
  CircleHelp,
  Hexagon,
  Settings2,
  ShieldCheck,
  X,
} from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { navigation } from '../../routes/navigation'
import { useAppStore } from '../../stores/useAppStore'
import { Button } from '../ui/button'
import { cn } from '../../utils/cn'
import { useIncidents } from '../../hooks/useIntelligence'

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="brand" aria-label="ThreatAtlas AI overview">
      <span className="brand-mark">
        <Hexagon size={30} strokeWidth={1.5} />
        <span className="brand-cross">T</span>
      </span>
      {!compact && (
        <span className="brand-name">
          THREATATLAS<span className="brand-ai">AI</span>
          <small>INTELLIGENCE. CONNECTED.</small>
        </span>
      )}
    </Link>
  )
}
export function AppSidebar() {
  const sidebar = useRef<HTMLElement>(null)
  const { data: incidents = [] } = useIncidents()
  const openIncidents = incidents.filter((incident) =>
    ['Open', 'Investigating'].includes(incident.status),
  ).length
  const {
    sidebarCollapsed,
    toggleSidebar,
    mobileNavOpen,
    setMobileNavOpen,
    organization,
    analystName,
  } = useAppStore()
  const initials = analystName
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
  useEffect(() => {
    if (!mobileNavOpen) return
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const focusable = () =>
      [
        ...(sidebar.current?.querySelectorAll<HTMLElement>('a[href], button:not([disabled])') ??
          []),
      ].filter((element) => element.offsetWidth > 0)
    focusable()[0]?.focus()
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileNavOpen(false)
      if (event.key !== 'Tab') return
      const elements = focusable()
      const first = elements[0]
      const last = elements[elements.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKey)
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [mobileNavOpen, setMobileNavOpen])
  return (
    <>
      {mobileNavOpen && (
        <button
          className="mobile-backdrop"
          aria-label="Close navigation"
          tabIndex={-1}
          onClick={() => setMobileNavOpen(false)}
        />
      )}
      <aside
        ref={sidebar}
        role={mobileNavOpen ? 'dialog' : undefined}
        aria-modal={mobileNavOpen || undefined}
        aria-label={mobileNavOpen ? 'Workspace navigation' : undefined}
        className={cn(
          'app-sidebar',
          sidebarCollapsed && 'sidebar-collapsed',
          mobileNavOpen && 'sidebar-mobile-open',
        )}
      >
        <div className="sidebar-brand">
          <Brand compact={sidebarCollapsed} />
          <Button
            className="mobile-close"
            variant="ghost"
            size="icon"
            aria-label="Close navigation"
            onClick={() => setMobileNavOpen(false)}
          >
            <X size={18} />
          </Button>
        </div>
        <Link
          to="/settings"
          className="workspace-switch"
          title="Organization settings"
          onClick={() => setMobileNavOpen(false)}
        >
          <span className="workspace-avatar">{organization[0]}</span>
          {!sidebarCollapsed && (
            <>
              <span>
                {organization}
                <small>Enterprise workspace</small>
              </span>
              <ChevronDown size={14} />
            </>
          )}
        </Link>
        <div className="nav-section-label">
          {sidebarCollapsed ? '•••' : 'INTELLIGENCE WORKSPACE'}
        </div>
        <nav className="sidebar-nav" aria-label="Main navigation">
          {navigation.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === '/'}
              title={sidebarCollapsed ? label : undefined}
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) => cn('nav-item', isActive && 'nav-item-active')}
            >
              <Icon size={18} strokeWidth={1.7} />
              {!sidebarCollapsed && (
                <>
                  <span>{label}</span>
                  {path === '/copilot' && <span className="new-badge">AI</span>}
                  {path === '/incidents' && openIncidents > 0 && (
                    <span className="nav-count">{openIncidents}</span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          {!sidebarCollapsed && (
            <div className="workspace-health">
              <span className="health-icon">
                <ShieldCheck size={18} />
              </span>
              <div>
                Intelligence, without noise.<small>Explore your demo workspace</small>
              </div>
              <span className="status-dot" />
            </div>
          )}
          <NavLink
            to="/settings"
            className="nav-item"
            title="Organization settings"
            onClick={() => setMobileNavOpen(false)}
          >
            <Settings2 size={18} />
            {!sidebarCollapsed && <span>Organization settings</span>}
          </NavLink>
          <NavLink
            to="/help"
            className="nav-item"
            title="Help and documentation"
            onClick={() => setMobileNavOpen(false)}
          >
            <CircleHelp size={18} />
            {!sidebarCollapsed && <span>Help & documentation</span>}
          </NavLink>
          <div className="sidebar-profile">
            <Link
              to="/settings"
              className="profile-link"
              title={`${analystName} profile`}
              onClick={() => setMobileNavOpen(false)}
            >
              <span className="avatar">{initials}</span>
              {!sidebarCollapsed && (
                <span>
                  {analystName}
                  <small>Security Analyst</small>
                </span>
              )}
            </Link>
            <Button
              variant="ghost"
              size="icon"
              aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              onClick={toggleSidebar}
            >
              {sidebarCollapsed ? <ChevronsRight size={16} /> : <ChevronsLeft size={16} />}
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
