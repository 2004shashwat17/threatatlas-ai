import axios from 'axios'
import { incidents, integrations, threats, vulnerabilities } from '../mocks/data'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
})

// Replace only these adapters when the ASP.NET Core API is available.
// No network requests are made for demonstration intelligence.
export const intelligenceService = {
  getThreats: async () => [...threats],
  getIncidents: async () => [...incidents],
  getVulnerabilities: async () => [...vulnerabilities],
  getIntegrations: async () => [...integrations],
}
