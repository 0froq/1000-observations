# 一千条个人站观察 / 1000 Personal Website Observations

froQ 用来收集最多 1000 条关于个人站的短观察：版式、字体、交互、文案等。当前仓库是**骨架**：约 30 条占位笔记（标题与正文含「占位」），UI 按 1000 条规模设计（分页加载、标签筛选、搜索、进度笔迹）。

基于 [paper-landing](https://github.com/0froq/paper-landing) 模板：纸纹、一笔墨线、kit 排版与中英 i18n。

## 本地运行

```bash
pnpm install
pnpm dev
```

```bash
pnpm build    # 必须通过
pnpm lint
pnpm preview
```

默认语言为中文（`/`）；英文在 `/en/...`。RSS：`/feed.xml`。

## 内容放在哪

**一条观察 = 一个 Markdown 文件**，便于扩到 1000 条且 diff 友好：

```
content/observations/0042.md
```

### Frontmatter 字段

| 字段 | 说明 |
| --- | --- |
| `number` | 1–1000，稳定编号，与文件名一致 |
| `title` | 一行标题 |
| `description` | 列表摘要（可选，建议写） |
| `date` | 添加日期，`YYYY-MM-DD` |
| `tags` | 来自 `shared/observation-tags.ts` 的小词表 |
| `siteName` / `siteUrl` | 被观察的站点（可选） |
| `screenshot` | 截图路径，相对 `public/`（可选，尚未在页面上展示） |

正文：短 Markdown。

### 新增一条

```bash
node scripts/next-observation-number.mjs
```

按提示创建 `content/observations/NNNN.md`，填写 frontmatter 与正文，保证 `number` 与文件名四位数一致。

路由：`/o/0042`（英文前缀时为 `/en/o/0042`）。

## 占位说明

- `content/observations/0001.md`–`0030.md`：短占位，均标「占位」。
- `about` 页、站点 meta 文案：待 froQ 填写。
- 截图字段已预留，列表/详情尚未挂图。
- `NUXT_PUBLIC_SITE_URL`：RSS 里的绝对链接（默认 `http://localhost:3000`）。

## 结构速览

| 路径 | 作用 |
| --- | --- |
| `/` | 首页：N/1000 进度、筛选、搜索、加载更多 |
| `/o/:id` | 单条：上一条/下一条、同标签相关 |
| `/tags` | 标签目录 |
| `/tags/:tag` | 单标签列表 |
| `/sites` | 观察过的站点汇总 |
| `/about` | 关于（占位） |

## 许可

手写字体见 `app/kit/hand-font.ts`（SIL OFL 1.1）。
