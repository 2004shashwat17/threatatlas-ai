import { threats } from '../mocks/data'

export function getDemoResponse(question: string): string {
  const text = question.toLowerCase()
  if (text.includes('ransomware'))
    return 'In this fictional dataset, 2 indicators are tagged as ransomware: 203.0.113.87 and backup-agent.example. Both are marked critical. Start by validating the original source context, then check whether these indicators appear in your environment. A category match alone does not confirm compromise.'
  if (text.includes('198.51.100.24') || text.includes('suspicious ip'))
    return '198.51.100.24 is a reserved documentation address, used here as a fictional botnet indicator. The demo record has 98% confidence and a critical severity. Its country-level marker is illustrative, not an attacker location. In a real investigation, corroborate with source evidence, DNS history, and internal network logs before acting.'
  if (text.includes('related'))
    return 'The globe illustrates 3 fictional relationships between indicators with explicit endpoints. These represent sample shared-infrastructure or campaign associations, not observed traffic or confirmed attacks. Validate temporal overlap, source provenance, and shared artifacts before treating two indicators as related.'
  if (text.includes('critical') || text.includes('today'))
    return `There are ${threats.filter((t) => t.severity === 'Critical').length} critical indicators in the complete fictional dataset. Prioritize the botnet and ransomware records, validate source confidence, and check for matches in internal telemetry. The overview's aggregate KPIs are separate illustrative metrics, not counts derived from this small sample.`
  return 'I can help explore this demonstration workspace. Try asking about critical threats, the sample IP 198.51.100.24, ransomware, or related indicators. Responses are predefined examples, not model-generated analysis or live intelligence. Always corroborate indicators before taking containment action.'
}
