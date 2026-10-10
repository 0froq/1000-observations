# 1000o.

froQ 的笔记本：一千个值得一看的个人网站。每个站是一个文档目录，里面可以有多篇笔记，打开后用侧栏在目录里走。现在是骨架，大约 30 个站，内容都标着 Placeholder。列表按一千个站来做（继续加载、标签、搜索，以及 N / 1000）。

纸面是 [paper-landing](https://github.com/0froq/paper-landing) 的纤维和颗粒。鼠标停住或点下去不会留下墨点，墨线也不会被拽弯。默认英文（`/`），中文在 `/zh`。

## 本地

```bash
pnpm install
pnpm dev
```

RSS：`/feed.xml`。

## 内容

一个站一个目录，目录里每篇笔记一个 Markdown 文件。`index.md` 是这个站。`nav` 是侧栏分组名，分组本身不是页面。子目录里的文件挂在该目录的 `index.md` 下面。

```
content/sites/0042/index.md
content/sites/0042/homepage.md
content/sites/0042/type/scale.md
```

`index.md`：

| 字段 | |
| --- | --- |
| `number` | 1–1000，和目录名一致 |
| `title` | 站名 |
| `description` | 列表里的摘要 |
| `date` | `YYYY-MM-DD` |
| `tags` | 见 `shared/observation-tags.ts` |
| `url` | 这个站本身，可空 |
| `label` | 侧栏上的短名，可空，空了用 `title` |
| `nav` | 侧栏分组 |
| `order` | 分组里的顺序 |

下一站编号：

```bash
node scripts/next-observation-number.mjs
```

路径是 `/s/0042`，某一篇是 `/s/0042/homepage`。

## 路由

| 路径 | |
| --- | --- |
| `/` | 首页：N / 1000 个站、筛选、搜索、继续加载 |
| `/s/:id` | 一个站的目录，侧栏列出里面的笔记 |
| `/s/:id/...` | 这个目录里的一篇 |
| `/tags` | 标签 |
| `/tags/:tag` | 某个标签下的站 |
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
