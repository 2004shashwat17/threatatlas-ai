import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import type { ReactNode } from 'react'
import CopilotPage from './CopilotPage'
import IncidentsPage from './IncidentsPage'
import IntegrationsPage from './IntegrationsPage'
import VulnerabilitiesPage from './VulnerabilitiesPage'
import { RecentThreatTable } from '../components/tables/RecentThreatTable'
import { useAppStore } from '../stores/useAppStore'

function renderPage(page: ReactNode) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>{page}</MemoryRouter>
    </QueryClientProvider>,
  )
}
beforeEach(() => useAppStore.setState({ timeRange: '24h' }))
describe('intelligence workflows', () => {
  it('searches indicators and opens truthful details', async () => {
    renderPage(<RecentThreatTable full />)
    await screen.findByRole('table')
    fireEvent.change(screen.getByRole('textbox', { name: 'Search intelligence' }), {
      target: { value: '198.51.100.24' },
    })
    fireEvent.click(screen.getByRole('button', { name: '198.51.100.24' }))
    const dialog = screen.getByRole('dialog')
    expect(within(dialog).getByText('98%')).toBeInTheDocument()
    expect(within(dialog).getByText(/does not identify an attacker/)).toBeInTheDocument()
  })
  it('filters vulnerabilities by severity and exploitation', async () => {
    renderPage(<VulnerabilitiesPage />)
    await screen.findByRole('table')
    fireEvent.change(screen.getByRole('combobox', { name: 'Vulnerability severity' }), {
      target: { value: 'Critical' },
    })
    fireEvent.change(screen.getByRole('combobox', { name: 'Exploitation status' }), {
      target: { value: 'Exploited' },
    })
    expect(screen.getAllByRole('row')).toHaveLength(3)
    expect(screen.queryByText('DEMO-CVE-003')).not.toBeInTheDocument()
  })
  it('creates and updates a fictional incident without a backend', async () => {
    renderPage(<IncidentsPage />)
    await screen.findByRole('table')
    fireEvent.click(screen.getByRole('button', { name: 'Create demo incident' }))
    const dialog = screen.getByRole('dialog')
    fireEvent.change(within(dialog).getByLabelText('Incident title'), {
      target: { value: 'Test investigation' },
    })
    fireEvent.submit(
      within(dialog).getByRole('button', { name: 'Create demo incident' }).closest('form')!,
    )
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByText('Test investigation')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'INC-2049' }))
    fireEvent.change(screen.getByLabelText('Status'), { target: { value: 'Resolved' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save demo changes' }))
    expect(screen.getByRole('status')).toHaveTextContent('No response actions were taken')
  })
  it('simulates an integration state without contacting a source', async () => {
    renderPage(<IntegrationsPage />)
    await screen.findByText('URLhaus')
    fireEvent.click(screen.getAllByRole('button', { name: /Configure demo/ })[0])
    fireEvent.click(screen.getByRole('button', { name: 'Simulate disconnection' }))
    expect(screen.getByRole('status')).toHaveTextContent('No connection was made')
  })
  it('returns a clearly labelled predefined copilot reply', async () => {
    renderPage(<CopilotPage />)
    fireEvent.change(screen.getByRole('textbox', { name: 'Message Atlas Copilot' }), {
      target: { value: 'Explain 198.51.100.24' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Send message' }))
    expect(screen.getByRole('status')).toHaveTextContent('Preparing sample response')
    await screen.findByText(/reserved documentation address/, {}, { timeout: 2000 })
    expect(screen.getByText('PREDEFINED DEMO')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'New conversation' }))
    expect(screen.getByText('Make sense of the signal.')).toBeInTheDocument()
  })
})
