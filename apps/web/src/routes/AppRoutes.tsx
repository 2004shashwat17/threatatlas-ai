import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppLayout } from '../components/layout/AppLayout'

const Overview = lazy(() => import('../pages/OverviewPage'))
const MapPage = lazy(() => import('../pages/MapPage'))
const Intelligence = lazy(() => import('../pages/IntelligencePage'))
const Vulnerabilities = lazy(() => import('../pages/VulnerabilitiesPage'))
const Analytics = lazy(() => import('../pages/AnalyticsPage'))
const Copilot = lazy(() => import('../pages/CopilotPage'))
const Incidents = lazy(() => import('../pages/IncidentsPage'))
const Integrations = lazy(() => import('../pages/IntegrationsPage'))
const Settings = lazy(() => import('../pages/SettingsPage'))
const Help = lazy(() => import('../pages/HelpPage'))
const NotFound = lazy(() => import('../pages/NotFoundPage'))

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="app-loading">
            <span className="spinner" />
            Initializing intelligence workspace...
          </div>
        }
      >
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<Overview />} />
            <Route path="map" element={<MapPage />} />
            <Route path="intelligence" element={<Intelligence />} />
            <Route path="vulnerabilities" element={<Vulnerabilities />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="copilot" element={<Copilot />} />
            <Route path="incidents" element={<Incidents />} />
            <Route path="integrations" element={<Integrations />} />
            <Route path="settings" element={<Settings />} />
            <Route path="help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
