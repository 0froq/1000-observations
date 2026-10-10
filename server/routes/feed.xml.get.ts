import { formatObservationId } from '#shared/observations'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'http://localhost:3000'
  const items = (await queryCollection(event, 'documents')
    .where('number', '>', 0)
    .order('date', 'DESC')
    .select('number', 'title', 'description', 'date')
    .all())
    .filter((item): item is typeof item & { number: number, date: string } => item.number != null && item.date != null)

  const escape = (s: string) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const entries = items.map((item) => {
    const id = formatObservationId(item.number)
    const link = `${siteUrl}/s/${id}`
    const desc = escape(item.description ?? '')
    return `
    <item>
      <title>${escape(`#${id} ${item.title}`)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${new Date(item.date).toUTCString()}</pubDate>
      <description>${desc}</description>
    </item>`
  }).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>1000o.</title>
    <link>${siteUrl}</link>
    <description>A thousand personal sites, each a folder of notes.</description>
    ${entries}
  </channel>
</rss>`

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return xml
})
