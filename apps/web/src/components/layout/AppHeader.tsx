import { useEffect, useState } from 'react'
import {
  Bell,
  ChevronDown,
  ChevronRight,
  Clock3,
  Command,
  Menu,
  Search,
  Settings2,
  UserRound,
  CircleHelp,
  ArrowUpRight,
  Check,
} from 'lucide-react'
import * as Dropdown from '@radix-ui/react-dropdown-menu'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { navigation } from '../../routes/navigation'
import { useAppStore } from '../../stores/useAppStore'
import { Button } from '../ui/button'
import { Modal, SearchBar, Select } from '../ui/primitives'
import { threats } from '../../mocks/data'
import type { TimeRange } from '../../types'

export function AppHeader() {
  const location = useLocation()
  const navigate = useNavigate()
  const { timeRange, setTimeRange, setMobileNavOpen, analystName, analystEmail } = useAppStore()
  const initials = analystName
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
  const [searchOpen, setSearchOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [read, setRead] = useState(false)
  const currentPage =
    navigation.find((item) => item.path === location.pathname)?.label ??
    (location.pathname === '/settings' ? 'Organization settings' : 'Help & documentation')
  useEffect(() => {
    document.title = `${currentPage} · THREATATLAS AI`
  }, [currentPage])
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault()
        setSearchOpen((open) => !open)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])
  const results = threats
    .filter((threat) =>
      `${threat.value} ${threat.country} ${threat.category}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    )
    .slice(0, 5)
  return (
    <header className="app-header">
      <div className="header-breadcrumb">
        <Button
          className="mobile-menu"
          size="icon"
          variant="ghost"
          aria-label="Open navigation"
          onClick={() => setMobileNavOpen(true)}
        >
          <Menu size={20} />
        </Button>
        <span className="breadcrumb-workspace">Workspace</span>
        <ChevronRight size={13} />
        <span>{currentPage}</span>
      </div>
      <div className="header-actions">
        <button className="global-search" onClick={() => setSearchOpen(true)}>
          <Search size={15} />
          <span>Search anything...</span>
          <kbd>
            <Command size={10} /> K
          </kbd>
        </button>
        <div className="header-time">
          <Clock3 size={14} />
          <Select
            label="Global time range"
            value={timeRange}
            onChange={(event) => setTimeRange(event.target.value as TimeRange)}
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </Select>
        </div>
        <span className="header-divider" />
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="notification-button"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {!read && <span className="notification-dot" />}
            </Button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content
              align="end"
              sideOffset={12}
              className="dropdown-content notification-dropdown"
            >
              <div className="dropdown-title">
                Notifications <span className="demo-label">DEMO</span>
              </div>
              <div className="notification-item">
                <span className="notification-symbol">
                  <ShieldCheckIcon />
                </span>
                <div>
                  <strong>Welcome to your workspace</strong>
                  <p>Explore fictional intelligence. No live sources are connected.</p>
                  <small>Demo notification</small>
                </div>
              </div>
              <Dropdown.Item onSelect={() => setRead(true)} className="dropdown-item">
                <Check size={15} />
                {read ? 'All notifications read' : 'Mark all as read'}
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
        <Dropdown.Root>
          <Dropdown.Trigger asChild>
            <button className="account-trigger" aria-label="Open account menu">
              <span className="avatar avatar-small">{initials}</span>
              <ChevronDown size={13} />
            </button>
          </Dropdown.Trigger>
          <Dropdown.Portal>
            <Dropdown.Content className="dropdown-content" align="end" sideOffset={12}>
              <div className="dropdown-title">
                {analystName}
                <small>{analystEmail}</small>
              </div>
              <Dropdown.Separator className="dropdown-separator" />
              <Dropdown.Item className="dropdown-item" asChild>
                <Link to="/settings">
                  <UserRound size={15} />
                  Profile & preferences
                </Link>
              </Dropdown.Item>
              <Dropdown.Item className="dropdown-item" asChild>
                <Link to="/settings">
                  <Settings2 size={15} />
                  Organization settings
                </Link>
              </Dropdown.Item>
              <Dropdown.Item className="dropdown-item" asChild>
                <Link to="/help">
                  <CircleHelp size={15} />
                  Documentation
                </Link>
              </Dropdown.Item>
            </Dropdown.Content>
          </Dropdown.Portal>
        </Dropdown.Root>
      </div>
      <Modal
        open={searchOpen}
        onOpenChange={setSearchOpen}
        title="Search your workspace"
        description="Find pages or fictional indicators. Press Cmd/Ctrl + K to open."
      >
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search pages, indicators, countries..."
          label="Global workspace search"
        />
        <div className="search-results">
          <span className="eyebrow">PAGES</span>
          {navigation
            .filter((item) => item.label.toLowerCase().includes(search.toLowerCase()))
            .slice(0, 4)
            .map(({ path, label, icon: Icon }) => (
              <button
                key={path}
                onClick={() => {
                  navigate(path)
                  setSearchOpen(false)
                }}
              >
                <Icon size={17} />
                <span>{label}</span>
                <ArrowUpRight size={14} />
              </button>
            ))}
          <span className="eyebrow">DEMONSTRATION INDICATORS</span>
          {results.map((threat) => (
            <button
              key={threat.id}
              onClick={() => {
                navigate(`/intelligence?q=${encodeURIComponent(threat.value)}`)
                setSearchOpen(false)
              }}
            >
              <Search size={15} />
              <span className="mono truncate">{threat.value}</span>
              <small>{threat.severity}</small>
            </button>
          ))}
          {results.length === 0 && <p className="muted text-sm">No matching indicators.</p>}
        </div>
      </Modal>
    </header>
  )
}
function ShieldCheckIcon() {
  return <Check size={17} />
}
