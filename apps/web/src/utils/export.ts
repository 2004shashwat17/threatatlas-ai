export function downloadJSON(filename: string, records: unknown) {
  const blob = new Blob(
    [
      JSON.stringify(
        { environment: 'demonstration', exportedAt: new Date().toISOString(), data: records },
        null,
        2,
      ),
    ],
    { type: 'application/json' },
  )
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
