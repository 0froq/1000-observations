# 1000o

froQ’s notebook of personal websites and design worth admiring — up to 1000 short notes. This is a skeleton: about 30 entries, each marked **Placeholder**. The views are built for the full thousand (load more, tag filters, search, a pen progress mark at N / 1000).

Built on the [paper-landing](https://github.com/0froq/paper-landing) kit: paper grain, one pen line, light/dark, zh/en. Default language is English (`/`); Chinese is at `/zh/...`.

The notes are appreciation, not a review.

## Run locally

```bash
pnpm install
pnpm dev
```

```bash
pnpm build
pnpm lint
pnpm preview
```

RSS: `/feed.xml`.

## Where content lives

**One note = one Markdown file**, so a thousand entries stay easy to diff:

```
content/observations/0042.md
```

| Field | |
| --- | --- |
| `number` | 1–1000, stable, matches the filename |
| `title` | One line |
| `description` | List summary |
| `date` | `YYYY-MM-DD` |
| `tags` | From `shared/observation-tags.ts` |
| `siteName` / `siteUrl` | The site being admired (optional) |
| `screenshot` | Path under `public/` (optional; not rendered yet) |

### Add a note

```bash
node scripts/next-observation-number.mjs
```

Create `content/observations/NNNN.md` with `number` matching the filename. Route: `/o/0042`.

## Placeholders

- `0001.md`–`0030.md` are short English placeholders.
- About copy is a stub.
- Set `NUXT_PUBLIC_SITE_URL` when RSS should use a real host.

## Routes

| Path | |
| --- | --- |
| `/` | Index: N / 1000, filters, search, load more |
| `/o/:id` | One note, previous / next, related by tag |
| `/tags` | Tag index |
| `/tags/:tag` | Notes for one tag |
| `/sites` | Sites, grouped, with counts |
| `/about` | About (placeholder) |

## License

Hand font: see `app/kit/hand-font.ts` (SIL OFL 1.1).
