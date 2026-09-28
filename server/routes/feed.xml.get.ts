import { formatObservationId } from '#shared/observations'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = config.public.siteUrl || 'http://localhost:3000'
  const items = await queryCollection(event, 'observations')
    .order('date', 'DESC')
    .select('number', 'title', 'description', 'date')
    .all()

  const escape = (s: string) => s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  const entries = items.map((item) => {
    const id = formatObservationId(item.number)
    const link = `${siteUrl}/o/${id}`
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
    <title>1000 Personal Website Observations</title>
    <link>${siteUrl}</link>
    <description>Short notes on personal websites.</description>
    ${entries}
  </channel>
</rss>`

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')
  return xml
})
