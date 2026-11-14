import { test, expect } from '@playwright/test'

test('desktop globe, geographic filters, and 2D worker render without runtime errors', async ({
  page,
}, testInfo) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text())
  })
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toContainText(
    'Your intelligence. In focus.',
  )
  await expect(page.locator('.stat-card')).toHaveCount(5)
  await expect(page.locator('.globe-loading')).toBeHidden({ timeout: 20_000 })
  await expect(page.locator('.globe-view canvas')).toBeVisible()
  await page.getByRole('button', { name: 'Pause globe rotation' }).click()
  await page.getByRole('button', { name: 'Zoom in', exact: true }).click()
  await page.getByRole('button', { name: 'Zoom out', exact: true }).click()
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.getByRole('combobox', { name: 'Map country', exact: true }).selectOption('Germany')
  await expect(page.locator('.map-corner-label')).toContainText('1 SAMPLE INDICATORS')
  const globe = await page.locator('.globe-view canvas').boundingBox()
  if (!globe) throw new Error('Globe canvas has no bounds')
  await page.mouse.move(globe.x + globe.width / 2, globe.y + globe.height / 2)
  await expect(page.locator('.globe-tooltip')).toContainText('Germany')
  await page.mouse.click(globe.x + globe.width / 2, globe.y + globe.height / 2)
  await expect(page.getByRole('complementary', { name: 'Threat indicator details' })).toContainText(
    'secure-update.example',
  )
  await page.getByRole('button', { name: 'Close threat details' }).click()
  await page.getByRole('button', { name: 'Reset map filters' }).click()
  await page.getByRole('button', { name: 'Reset map view' }).click()
  await page.screenshot({ path: testInfo.outputPath('overview-desktop.png'), fullPage: true })
  await page.getByRole('button', { name: '2D', exact: true }).click()
  await expect(page.locator('.maplibre-container')).toHaveAttribute('data-ready', 'true', {
    timeout: 20_000,
  })
  await expect(page.locator('.map-error')).toHaveCount(0)
  await expect(page.locator('.maplibregl-canvas')).toBeVisible()
  await page.getByRole('combobox', { name: 'Map country', exact: true }).selectOption('Germany')
  const map = await page.locator('.maplibregl-canvas').boundingBox()
  if (!map) throw new Error('Map canvas has no bounds')
  await page.mouse.click(map.x + map.width / 2, map.y + map.height / 2)
  await expect(page.getByRole('complementary', { name: 'Threat indicator details' })).toContainText(
    'secure-update.example',
  )
  await page.getByRole('button', { name: 'Close threat details' }).click()
  await page.getByRole('button', { name: 'Reset map filters' }).click()
  await page.getByRole('combobox', { name: 'Global time range' }).selectOption('30d')
  await expect(page.locator('.map-corner-label')).toContainText('15 SAMPLE INDICATORS')
  await page.getByRole('combobox', { name: 'Map threat category' }).selectOption('Ransomware')
  await expect(page.locator('.map-corner-label')).toContainText('2 SAMPLE INDICATORS')
  await page.screenshot({ path: testInfo.outputPath('map-2d-desktop.png') })
  expect(errors).toEqual([])
})

test('all navigation pages and mock workflows work', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/intelligence')
  await page.getByRole('textbox', { name: 'Search intelligence' }).fill('198.51.100.24')
  await expect(page.getByRole('row')).toHaveCount(2)
  await page.getByRole('button', { name: '198.51.100.24' }).click()
  await expect(page.getByRole('dialog')).toContainText('98%')
  await page.keyboard.press('Escape')
  for (const [label, heading] of [
    ['Vulnerability Intel', 'Know your exposure.'],
    ['Threat Analytics', 'Turn signals into perspective.'],
    ['AI Security Copilot', 'Your next investigative advantage.'],
    ['Incidents', 'From intelligence to action.'],
    ['Integrations', 'Better together. By design.'],
  ]) {
    await page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: label })
      .click()
    await expect(page.getByRole('heading', { level: 1 })).toContainText(heading)
  }
  await page.getByRole('button', { name: 'Configure demo' }).first().click()
  await page.getByRole('button', { name: 'Simulate disconnection' }).click()
  await expect(page.getByRole('status')).toContainText('No connection was made')
  await page.getByRole('link', { name: 'AI Security Copilot' }).click()
  await page.getByRole('textbox', { name: 'Message Atlas Copilot' }).fill('Summarize ransomware')
  await page.getByRole('button', { name: 'Send message' }).click()
  await expect(page.getByRole('log')).toContainText('2 indicators are tagged as ransomware')
  await page.getByRole('link', { name: 'Incidents', exact: false }).click()
  await page.getByRole('button', { name: 'Create demo incident' }).click()
  await page.getByLabel('Incident title').fill('Browser validation incident')
  await page.getByRole('dialog').getByRole('button', { name: 'Create demo incident' }).click()
  await expect(page.getByRole('dialog')).toBeHidden()
  await expect(page.getByRole('table')).toContainText('Browser validation incident')
  await page.getByRole('link', { name: 'Organization settings', exact: true }).last().click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Make this workspace yours.')
  await page.getByRole('link', { name: 'Help & documentation' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Context for every question.')
  expect(errors).toEqual([])
})

test('mobile layout keeps all metrics, accessible navigation, and reduced-motion map', async ({
  page,
}, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/')
  await expect(page.locator('.stat-card')).toHaveCount(5)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.getByRole('button', { name: 'Open navigation' }).click()
  await page.getByRole('link', { name: 'Global Threat Map', exact: true }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('A world of context.')
  await expect(page.locator('.sidebar-mobile-open')).toHaveCount(0)
  await page.getByRole('button', { name: '2D', exact: true }).click()
  await expect(page.locator('.maplibre-container')).toHaveAttribute('data-ready', 'true', {
    timeout: 20_000,
  })
  await page.getByRole('combobox', { name: 'Inspect a sample indicator' }).selectOption('ioc-001')
  await expect(page.getByRole('complementary', { name: 'Threat indicator details' })).toContainText(
    'not identify an attacker',
  )
  await page.screenshot({ path: testInfo.outputPath('map-mobile.png'), fullPage: true })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})
