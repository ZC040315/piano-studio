# STORMCAP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建「STORMCAP」—— 一个 React + Vite 的单页网站，实时聚合 Openverse 开放图库的天气摄影作品，按天气现象分类浏览，并以 Dark Storm 深色杂志风呈现，内置精选集作降级兜底。

**Architecture:** 纯前端静态 SPA。浏览器直连 Openverse API（带 8s 超时与降级），数据层标准化为内部 Photo 模型；`usePhotos` hook 管理列表状态机（loading / success / error / degraded / 分页）。React Router 提供 首页 / 分类 / 搜索 / 关于 四个路由；详情用弹层（Lightbox）。视觉系统通过 CSS 变量 token 定义。

**Tech Stack:** React 18、Vite、React Router DOM、原生 CSS（tokens + BEM）、Vitest（数据层单测）、Browser 插件（UI 验证）。

---

## 文件结构

```
public/assets/curated/*.jpg        # 内置精选照片（本地打包）
src/
  main.jsx                         # 入口（BrowserRouter）
  App.jsx                          # 路由与布局（Header/Footer 壳）
  styles/tokens.css                # 设计令牌（Dark Storm）
  styles/global.css                # 基础样式、排版、动效
  api/openverse.js                 # Openverse 客户端（查询/分页/超时/降级）
  lib/photo.js                     # Photo 模型标准化 + 兜底合并
  data/categories.js               # 分类配置与关键词映射
  data/curated.js                  # 内置精选集
  hooks/usePhotos.js               # 列表状态机 + 缓存 + 无限滚动
  components/
    Header.jsx / SearchBox.jsx / Hero.jsx / CategoryRail.jsx /
    MasonryGrid.jsx / PhotoCard.jsx / Lightbox.jsx / Skeleton.jsx /
    SourceBadge.jsx / Footer.jsx
  pages/
    HomePage.jsx / CategoryPage.jsx / SearchPage.jsx / AboutPage.jsx
index.html
vite.config.js
README.md
```

**Photo 模型（全站统一）：**
```js
{
  id: string,          // 稳定唯一 id
  title: string,       // 展示标题（现象 · 地点）
  photographer: string,
  source: string,      // 'Flickr' | 'Wikimedia' | 'Curated' | ...
  license: string,     // 如 'CC BY 2.0'
  url: string,         // 详情页/原图链接（外链）
  thumbnail: string,   // 列表小图
  image: string,       // 弹层大图
  location: string,
  category: string,    // 分类 slug
  degraded: boolean,   // 是否来自内置兜底
}
```

---

### Task 1: 脚手架与依赖

**Files:** `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`（最小占位）

- [ ] **Step 1: 用 Vite 创建 React 项目**

Run: `npm create vite@latest . -- --template react`

Expected: 项目文件生成于当前目录。

- [ ] **Step 2: 安装依赖**

Run: `npm install react-router-dom && npm install -D vitest`

- [ ] **Step 3: 配置 vitest（`vite.config.js`）**

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: { environment: 'node', globals: true },
})
```

- [ ] **Step 4: 清理脚手架默认样式，建立最小入口**

`src/main.jsx`：
```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/tokens.css'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

`src/App.jsx`：`Routes` 占位（Home / Category / Search / About，各自先渲染标题）。

- [ ] **Step 5: 提交**

```bash
git add -A
git commit -m "chore: scaffold Vite React app with router and vitest"
```

---

### Task 2: 设计令牌与全局样式

**Files:** Create `src/styles/tokens.css`, `src/styles/global.css`

- [ ] **Step 1: 写 `tokens.css`（Dark Storm 全部令牌）**

```css
:root {
  --bg: #0B0E13;
  --surface: #14181F;
  --surface-2: #1A2029;
  --text: #E8ECF2;
  --text-muted: #9AA4B3;
  --text-faint: #6F7886;
  --accent: #F4B942;
  --accent-ink: #141414;
  --line: rgba(255,255,255,.08);
  --line-strong: rgba(255,255,255,.14);
  --radius: 6px;
  --radius-lg: 10px;
  --font-sans: system-ui, -apple-system, "PingFang SC", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif;
  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 34px; --space-7: 48px;
  --ease: cubic-bezier(.22,.61,.36,1);
}
```

- [ ] **Step 2: 写 `global.css`（基础排版、容器、骨架、动效）**

关键要求：
- `body`：`background: var(--bg)`、`color: var(--text)`、`font-family: var(--font-sans)`、`-webkit-font-smoothing: antialiased`。
- `*{box-sizing:border-box}`；`a` 无下划线；`img{display:block;max-width:100%}`。
- 容器 `.container`：`max-width: 1280px; margin: 0 auto; padding: 0 var(--space-6);`（移动端 `padding: 0 var(--space-4)`）。
- 动效类：`.fade-in`（opacity/translateY 0.35s var(--ease)）、`@media (prefers-reduced-motion: reduce)` 关闭动画。
- 骨架类 `.skeleton`：`background: linear-gradient(90deg, var(--surface-2) 25%, #222933 50%, var(--surface-2) 75%); background-size: 200% 100%; animation: shimmer 1.4s infinite;`。

- [ ] **Step 3: 提交**

```bash
git add src/styles
git commit -m "style: add Dark Storm design tokens and global styles"
```

---

### Task 3: 数据层 —— 分类、Openverse 客户端、兜底（TDD）

**Files:** Create `src/data/categories.js`, `src/data/curated.js`, `src/api/openverse.js`, `src/lib/photo.js`; Test `src/api/openverse.test.js`, `src/lib/photo.test.js`

- [ ] **Step 1: 写失败测试 `openverse.test.js`**

```js
import { describe, it, expect, vi } from 'vitest'
import { fetchOpenversePhotos } from './openverse'

describe('fetchOpenversePhotos', () => {
  it('解析 Openverse 响应为 Photo 数组', async () => {
    const json = { results: [{ id: 'a1', title: 'lightning', creator: 'Alice', license: 'by', license_url: 'https://x', url: 'https://detail', thumbnail: 'https://t', foreign_landing_url: 'https://landing', source: 'flickr', width: 1000, height: 800 }], page: 1, page_count: 1, result_count: 1 }
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve(json) })
    const out = await fetchOpenversePhotos({ query: 'lightning', page: 1, signal: new AbortController().signal })
    expect(out.items[0]).toMatchObject({ id: 'a1', photographer: 'Alice', source: 'Flickr' })
    expect(out.page).toBe(1)
  })

  it('网络失败时抛出可识别错误', async () => {
    global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(fetchOpenversePhotos({ query: 'rainbow', page: 1 })).rejects.toThrow('NETWORK')
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run src/api/openverse.test.js`
Expected: FAIL（模块不存在）。

- [ ] **Step 3: 实现 `openverse.js`**

```js
const BASE = 'https://api.openverse.org/v1/images/'
const TIMEOUT_MS = 8000

function normalizeSource(source) {
  if (!source) return 'Openverse'
  const map = { flickr: 'Flickr', wikimedia: 'Wikimedia', 'wordpress': 'WordPress' }
  return map[source] || source
}

export async function fetchOpenversePhotos({ query, page = 1, signal, timeoutMs = TIMEOUT_MS }) {
  const params = new URLSearchParams({ q: query, page: String(page), per_page: '24' })
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const onAbort = () => controller.abort()
  signal?.addEventListener('abort', onAbort)
  try {
    let res
    try {
      res = await fetch(`${BASE}?${params}`, { signal: controller.signal })
    } catch (e) {
      throw new Error('NETWORK')
    }
    if (!res.ok) throw new Error('HTTP_' + res.status)
    const json = await res.json()
    const items = (json.results || []).map((r) => ({
      id: String(r.id),
      title: r.title || r.tags?.slice(0, 2).map((t) => t.name).join(' · ') || '天气摄影',
      photographer: r.creator || '未知摄影师',
      source: normalizeSource(r.source),
      license: r.license ? `CC ${r.license.replace(/^by/, 'BY')}` : 'CC',
      url: r.foreign_landing_url || r.url,
      thumbnail: r.thumbnail || r.url,
      image: r.url,
      location: r.tags?.map((t) => t.name).filter((n) => n.length <= 12).slice(0, 2).join(' · ') || '',
      category: query,
      degraded: false,
    }))
    return { items, page: json.page || page, hasMore: page < (json.page_count || 1) }
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', onAbort)
  }
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run src/api/openverse.test.js`
Expected: PASS（2 个用例）。

- [ ] **Step 5: 写 `categories.js`（分类 → 关键词映射）**

```js
export const CATEGORIES = [
  { slug: 'thunderstorm', label: '雷暴', query: 'lightning storm thunderstorm' },
  { slug: 'rainbow', label: '彩虹', query: 'rainbow' },
  { slug: 'snow', label: '雪', query: 'snow snowfall winter storm' },
  { slug: 'fog', label: '雾', query: 'fog foggy mist' },
  { slug: 'aurora', label: '极光', query: 'aurora northern lights' },
  { slug: 'clouds', label: '云海', query: 'sea of clouds sunrise' },
  { slug: 'typhoon', label: '台风', query: 'typhoon hurricane storm clouds' },
]
export function getCategory(slug) {
  return CATEGORIES.find((c) => c.slug === slug) || null
}
```

- [ ] **Step 6: 写 `curated.js`（内置精选，12–18 条；前 8 条用本地打包图 `assets/curated/*.jpg`，其余用稳定远程 URL）**

每条：`{ id, title, photographer, source: 'Curated', license: 'CC', url: '#', thumbnail, image, location, category }`；`source` 展示为「精选」。

- [ ] **Step 7: 写失败测试 `photo.test.js` + 实现 `lib/photo.js`**

`lib/photo.js`：
```js
import { CATEGORIES } from '../data/categories'
import { CURATED } from '../data/curated'

export function mergePhotos(live, categorySlug) {
  if (live.length > 0) return live
  const cat = CATEGORIES.find((c) => c.slug === categorySlug)
  return CURATED.filter((p) => !cat || p.category === categorySlug).map((p) => ({ ...p, degraded: true }))
}
```

测试：`mergePhotos([], 'aurora')` 返回含 `degraded: true` 的兜底列表；`mergePhotos([live], 'aurora')` 返回 live 且不含兜底。

- [ ] **Step 8: 全部数据层测试通过并提交**

Run: `npx vitest run`
Expected: 全部 PASS。

```bash
git add src/data src/api src/lib
git commit -m "feat: data layer with Openverse client, categories, curated fallback"
```

---

### Task 4: `usePhotos` 状态机 hook（TDD）

**Files:** Create `src/hooks/usePhotos.js`; Test `src/hooks/usePhotos.test.jsx`

- [ ] **Step 1: 写失败测试（用 @testing-library/react 渲染探针组件，或抽纯 reducer 测试）**

为可测性，把状态机抽成纯函数 `src/lib/photosReducer.js`：
```js
export const initialState = { items: [], page: 1, status: 'idle', degraded: false, hasMore: true }
export function photosReducer(state, action) {
  switch (action.type) {
    case 'LOAD': return { ...state, status: 'loading' }
    case 'OK': return { ...state, status: 'success', items: action.append ? [...state.items, ...action.items] : action.items, page: action.page, hasMore: action.hasMore, degraded: false }
    case 'DEGRADED': return { ...state, status: 'success', items: action.items, page: 1, hasMore: false, degraded: true }
    case 'ERROR': return { ...state, status: 'error' }
    case 'RESET': return { ...initialState }
  }
  return state
}
```

测试：LOAD→OK 追加分页、空结果触发 DEGRADED（由 hook 调 `mergePhotos` 后派发）、ERROR 状态。

- [ ] **Step 2: 实现 `usePhotos.js`**

```js
import { useCallback, useEffect, useReducer, useRef } from 'react'
import { fetchOpenversePhotos } from '../api/openverse'
import { mergePhotos } from '../lib/photo'
import { photosReducer, initialState } from '../lib/photosReducer'

export function usePhotos({ query, category, enabled = true }) {
  const [state, dispatch] = useReducer(photosReducer, initialState)
  const cache = useRef(new Map())
  const requestSeq = useRef(0)

  const load = useCallback(async ({ append = false } = {}) => {
    const key = `${query}:${append ? state.page + 1 : 1}`
    if (!append && cache.current.has(`${query}:1`)) {
      const cached = cache.current.get(`${query}:1`)
      dispatch({ type: 'OK', items: cached.items, page: cached.page, hasMore: cached.hasMore })
      return
    }
    const seq = ++requestSeq.current
    dispatch({ type: 'LOAD' })
    try {
      const data = await fetchOpenversePhotos({ query, page: append ? state.page + 1 : 1 })
      if (seq !== requestSeq.current) return
      const merged = mergePhotos(data.items, category)
      if (merged.some((p) => p.degraded)) dispatch({ type: 'DEGRADED', items: merged })
      else {
        cache.current.set(`${query}:1`, { items: data.items, page: data.page, hasMore: data.hasMore })
        dispatch({ type: 'OK', items: data.items, page: data.page, hasMore: data.hasMore, append })
      }
    } catch {
      if (seq !== requestSeq.current) return
      const merged = mergePhotos([], category)
      dispatch({ type: 'DEGRADED', items: merged })
    }
  }, [query, category, state.page])

  useEffect(() => {
    if (enabled) load()
  }, [enabled, load])

  return { ...state, loadMore: () => load({ append: true }), retry: () => load() }
}
```

- [ ] **Step 3: 测试通过并提交**

```bash
git add src/hooks src/lib/photosReducer.js
git commit -m "feat: usePhotos state machine with caching and degradation"
```

---

### Task 5: 核心组件

**Files:** Create `src/components/Header.jsx`, `SearchBox.jsx`, `Hero.jsx`, `CategoryRail.jsx`, `MasonryGrid.jsx`, `PhotoCard.jsx`, `Lightbox.jsx`, `Skeleton.jsx`, `SourceBadge.jsx`, `Footer.jsx`

每个组件遵循设计文档（见 spec §3）：

- [ ] **Step 1: `Header.jsx`** —— 吸顶、半透明深色背景 + backdrop blur；左 logo「STORMCAP」（琥珀，`letter-spacing:.16em`）；中导航 精选 `/`、分类 `/#categories`（滚动锚点）、关于 `/about`；右 `SearchBox`。
- [ ] **Step 2: `SearchBox.jsx`** —— 胶囊输入框（`--surface` 底、`--line-strong` 边框、占位「搜索地点 / 现象」），回车跳转 `/search?q=...`。
- [ ] **Step 3: `Hero.jsx`** —— 全宽大图（`public/assets/curated/hero.jpg`，约 1600×900，object-fit cover）+ 底部深色渐变（`linear-gradient(180deg, rgba(11,14,19,.08) 30%, rgba(11,14,19,.94))`）；FEATURED 琥珀标签（`letter-spacing:.28em`）+ H1「捕捉天空的瞬息万变」+ 副标题「全网天气摄影 · 来自开放图库 · 每日更新」+ 琥珀 CTA「进入画廊」（锚点 `#gallery`）。
- [ ] **Step 4: `CategoryRail.jsx`** —— 胶囊 chips（全部 + 7 分类，props：`active`、`onSelect`）；「全部」选中态琥珀填充；横向可滚动。
- [ ] **Step 5: `MasonryGrid.jsx` / `PhotoCard.jsx`** —— CSS columns 瀑布流（`columns: 3; gap: 14px`，移动端 2 列、窄屏 1 列）；`PhotoCard` 图片 6px 圆角，hover 浮现「现象 · 地点」渐变层；点击打开详情。
- [ ] **Step 6: `Lightbox.jsx`** —— 全屏遮罩（rgba(5,7,10,.9)），左大图 + 右元数据面板（摄影师 / 来源图库 / 拍摄信息 / 授权 / 查看原图按钮外链）；Esc 关闭、点击遮罩关闭、锁 body 滚动。
- [ ] **Step 7: `Skeleton.jsx` / `SourceBadge.jsx` / `Footer.jsx`** —— 骨架瓦片（`--surface-2` shimmer）；来源徽标（Flickr / Wikimedia / 精选，小字胶囊）；页脚（站点说明 + 图源声明 + © 2026 STORMCAP）。
- [ ] **Step 8: 提交**

```bash
git add src/components
git commit -m "feat: core UI components (header, hero, rail, masonry, lightbox)"
```

---

### Task 6: 页面与路由

**Files:** Modify `src/App.jsx`; Create `src/pages/HomePage.jsx`, `CategoryPage.jsx`, `SearchPage.jsx`, `AboutPage.jsx`

- [ ] **Step 1: `HomePage.jsx`** —— `<Hero/>` + `<CategoryRail/>`（`id="categories"`）+ `<MasonryGrid/>`（`id="gallery"`，默认分类=全部→`query` 轮询各分类首个结果或聚合请求）。
- [ ] **Step 2: `CategoryPage.jsx`** —— 读 `useParams().slug`，取分类标签作为页面标题（「雷暴 · 精选」），复用 CategoryRail + MasonryGrid；`query = 该分类关键词`。
- [ ] **Step 3: `SearchPage.jsx`** —— 读 `useSearchParams().q`，标题「“q” 的搜索结果」；空结果显示空状态文案与返回精选建议。
- [ ] **Step 4: `AboutPage.jsx`** —— 站点说明、图源（Openverse / Flickr / Wikimedia）、CC 授权说明、降级策略说明。
- [ ] **Step 5: `App.jsx`** —— `<Header/>` + `<Routes>` + `<Footer/>`；404 重定向首页。
- [ ] **Step 6: 提交**

```bash
git add src
git commit -m "feat: pages and routing for home, category, search, about"
```

---

### Task 7: 内置精选图片与概念资产

**Files:** `public/assets/curated/*.jpg`, `src/data/curated.js`（更新）

- [ ] **Step 1: 获取 8+ 张真实 CC 天气摄影（Wikimedia Commons 稳定 URL），下载到 `public/assets/curated/`**（若沙箱无网络则升级权限；下载失败则用稳定远程 URL 并在 README 注明）。
- [ ] **Step 2: 按分类分布更新 `curated.js`**（雷暴 2、彩虹 1、雪 2、雾 2、极光 2、云海 1、台风 1、其他 1），保证每个分类兜底均有图。
- [ ] **Step 3: 提交**

```bash
git add public src/data/curated.js
git commit -m "assets: bundle curated weather photography fallback set"
```

---

### Task 8: 设计概念图（依赖 Image Gen 可用性）

**Files:** `docs/design/concepts/*.png`（工作区）

- [ ] **Step 1: 若内置 image_gen 工具可用**：按 frontend-app-builder 标准生成首页 Hero / 画廊 / 详情弹层三张概念图（Dark Storm 视觉，中文文案）。
- [ ] **Step 2: 若工具不可用**：与用户确认（CLI 回退需 `OPENAI_API_KEY`，或用户明确选择跳过 AI 概念图，以已批准的设计文档 + 浏览器线框稿作为视觉规范，并记录为 intentional deviation）。

---

### Task 9: 验证与联调

**Files:** 无（仅运行与修错）

- [ ] **Step 1: `npm run build` 通过，无控制台错误。**
- [ ] **Step 2: Browser 验证桌面视口**：首页首屏 → 分类切换 → 搜索 → 详情弹层 → 无限滚动 → 降级提示；截图。
- [ ] **Step 3: Browser 验证移动视口**（375px）：导航、瀑布流列数、弹层布局。
- [ ] **Step 4: 设计还原对比**：按 spec §3 逐项核对色彩 / 排版 / 间距 / 容器模型 / 动效，≥5 个对比点；截图与概念/线框 `view_image` 同轮比对。
- [ ] **Step 5: 修复所有可见漂移后提交**

```bash
git add -A
git commit -m "fix: visual fidelity and interaction verification pass"
```

---

### Task 10: README 与交付

**Files:** Create `README.md`

- [ ] **Step 1: 写 README**：项目简介、本地运行（`npm install && npm run dev`）、构建（`npm run build`）、部署（静态托管）、图源与授权说明、降级策略。
- [ ] **Step 2: 提交并输出最终交付说明。**
