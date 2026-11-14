import { useQuery } from '@tanstack/react-query'
import { intelligenceService } from '../services/api'
export const useThreats = () =>
  useQuery({ queryKey: ['threats', 'demo'], queryFn: intelligenceService.getThreats })
export const useIncidents = () =>
  useQuery({ queryKey: ['incidents', 'demo'], queryFn: intelligenceService.getIncidents })
export const useVulnerabilities = () =>
  useQuery({
    queryKey: ['vulnerabilities', 'demo'],
    queryFn: intelligenceService.getVulnerabilities,
  })
export const useIntegrations = () =>
  useQuery({ queryKey: ['integrations', 'demo'], queryFn: intelligenceService.getIntegrations })
