import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { AppSidebar } from './AppSidebar'
import { AppHeader } from './AppHeader'
import { useAppStore } from '../../stores/useAppStore'
import { cn } from '../../utils/cn'

export function AppLayout() {
  const collapsed = useAppStore((state) => state.sidebarCollapsed)
  const location = useLocation()
  const content = useRef<HTMLElement>(null)
  useEffect(() => {
    const context = gsap.context(() => {
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.fromTo(
          content.current,
          { opacity: 0, y: 7 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', clearProps: 'all' },
        )
      }
    }, content)
    content.current?.scrollTo(0, 0)
    return () => context.revert()
  }, [location.pathname])
  return (
    <div className={cn('app-layout', collapsed && 'layout-collapsed')}>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <AppSidebar />
      <div className="main-shell">
        <AppHeader />
        <main ref={content} id="main-content" className="page-container" tabIndex={-1}>
          <Outlet />
          <footer className="app-footer">
            <span>
              <span className="status-dot" />
              Demonstration environment <span className="footer-separator">/</span> No live
              telemetry
            </span>
            <span>
              THREATATLAS AI <span className="footer-separator">·</span> Intelligence. Connected.
            </span>
          </footer>
        </main>
      </div>
    </div>
  )
}
