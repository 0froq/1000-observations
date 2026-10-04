# 1000o.

froQ 的笔记本：给值得欣赏的个人网站和设计写短记，最多一千条。现在是骨架，大约 30 条，每条都标着 Placeholder。列表按一千条来做（继续加载、标签、搜索，以及 N / 1000）。

纸面是 [paper-landing](https://github.com/0froq/paper-landing) 的纤维和颗粒。鼠标停住或点下去不会留下墨点，墨线也不会被拽弯。默认英文（`/`），中文在 `/zh`。

## 本地

```bash
pnpm install
pnpm dev
```

RSS：`/feed.xml`。

## 内容

一条笔记一个 Markdown 文件：

```
content/observations/0042.md
```

| 字段 | |
| --- | --- |
| `number` | 1–1000，和文件名一致 |
| `title` | 一行 |
| `description` | 列表里的摘要 |
| `date` | `YYYY-MM-DD` |
| `tags` | 见 `shared/observation-tags.ts` |
| `siteName` / `siteUrl` | 被记下的网站，可空 |
| `screenshot` | `public/` 下的路径，可空，页面上还没画 |

下一条编号：

```bash
node scripts/next-observation-number.mjs
```

路径是 `/o/0042`。

## 路由

| 路径 | |
| --- | --- |
| `/` | 首页：N / 1000、筛选、搜索、继续加载 |
| `/o/:id` | 一条笔记，上一条 / 下一条，同标签 |
| `/tags` | 标签 |
| `/tags/:tag` | 某个标签下的笔记 |
| `/sites` | 按网站归在一起 |
| `/about` | 关于 |

## 发布

推到 `main` 后，由 Workers Builds（GitHub 连接，仓库不存放 API token）构建并发布。网页里新建的是 Worker，不是 Pages。构建命令是 `pnpm generate`，部署命令是 `pnpm exec cf deploy`。静态文件在 `dist`。Worker 配置在 `cloudflare.config.ts`，资源目录在 `wrangler.config.ts`。本地一次发布用 `pnpm deploy`。

以后的站点按 [0froq/skills](https://github.com/0froq/skills) 里的 `cloudflare-sites` 做。不要照抄 void、paper-landing、lig。

```bash
pnpm dev        # 开发
pnpm generate   # 静态站点，输出到 dist
pnpm deploy     # 生成并 cf deploy
pnpm build      # 带服务端的构建
pnpm lint
pnpm typecheck
```

## 许可

手写字体来自 EMS Allure（Allura 的单线衍生版，Sheldon B. Michaels），SIL Open Font License 1.1，见 `app/kit/hand-font.ts` 文件头。
