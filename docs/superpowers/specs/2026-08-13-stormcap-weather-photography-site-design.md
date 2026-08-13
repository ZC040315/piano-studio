# STORMCAP — 全网天气摄影画廊 设计文档

日期：2026-08-13
状态：已获用户确认

## 1. 背景与目标

构建一个整合全网天气摄影的网站「STORMCAP」：像一本不断更新的天气摄影杂志，精选并实时聚合全网（开放图库）高质量天气摄影作品，按天气现象分类浏览，主打沉浸式欣赏。

成功标准：
- 首屏即惊艳：深色杂志感视觉 + 大图沉浸式体验。
- 真正“全网聚合”：通过 Openverse API 实时拉取 Flickr / Wikimedia Commons 等开放图库的 CC 授权天气摄影，标注摄影师与原始来源。
- 断网 / 接口失败时可降级：内置精选作品集保证站点始终可用；核心图片本地打包，尽量离线可看。
- 桌面与移动端体验完整，核心浏览链路顺畅。

## 2. 范围（已确认）

### 2.1 功能范围：核心画廊
- 首页沉浸式精选大图（hero）。
- 天气现象分类（全部 / 雷暴 / 彩虹 / 雪 / 雾 / 极光 / 云海 / 台风）。
- 关键词搜索（支持“地点 + 现象”，如“冰岛 极光”）。
- 图片详情弹层：摄影师、来源图库、原始链接、授权信息、查看原图。
- 瀑布流画廊 + 无限滚动加载。
- 关于页：说明站点与图源（开放图库 + CC 授权）。
- 数据兜底：内置精选集，请求失败或超时时自动降级。

不在本期范围（后续可加）：本地收藏、随机一张、地点/色调筛选、每日一图专题、天气现象百科、用户社区。

### 2.2 内容来源
- 主源：Openverse API（`https://api.openverse.org/v1/images/`），按分类关键词查询，附带摄影师、来源、license、原始 URL。
- 兜底源：内置精选集（约 12–18 条作品数据；其中核心 6–8 张使用本地打包图片，保证降级/离线时画廊仍有图，其余使用稳定远程占位 URL，需联网加载）。
- 加载策略：按分类关键词惰性拉取 + 分页；结果按分类缓存于内存；失败 / 超时（约 8s）自动降级到内置集合并提示来源徽标。

## 3. 视觉设计（Dark Storm）

### 3.1 设计令牌
| Token | 值 | 用途 |
|---|---|---|
| `--bg` | `#0B0E13` | 页面背景（近黑） |
| `--surface` | `#14181F` | 卡片 / 弹层表面 |
| `--surface-2` | `#1A2029` | 二级表面 / 骨架 |
| `--text` | `#E8ECF2` | 正文 |
| `--text-muted` | `#9AA4B3` | 弱化文字 / 标签 |
| `--text-faint` | `#6F7886` | 注释级文字 |
| `--accent` | `#F4B942` | 强调色（琥珀） |
| `--line` | `rgba(255,255,255,.08)` | 分隔线 / 边框 |
| 圆角 | 6px（大图）/ 10px（弹层） | — |

### 3.2 字体与排版
- 中文字体：系统栈（PingFang SC / Microsoft YaHei / Noto Sans CJK）+ sans-serif。
- 英文编辑感：大字距（letter-spacing 0.16–0.28em）用于 logo 与 FEATURED 标签。
- 层级：Hero H1（约 40px+，800 字重）、区块标题（20–24px、800）、正文 14px、标签/说明 11–12px。

### 3.3 布局与组件
- 顶部导航：logo（STORMCAP，琥珀色）+ 导航（精选 / 分类 / 关于）+ 搜索框（胶囊形）。
- Hero：全宽大图，底部深色渐变，FEATURED 标签 + 大标题 + 副标题 + 琥珀色 CTA「进入画廊」。
- 分类条：胶囊 chips，横向可滚动，「全部」默认选中。
- 瀑布流：3 列不对称（移动端 1–2 列），图片 6px 圆角，hover 浮现「现象 · 地点」。
- 详情弹层：左侧大图 + 右侧元数据（摄影师 / 来源图库 / 拍摄信息 / 授权 / 查看原图按钮）。
- 加载状态：骨架屏；加载更多提示「正在加载更多作品…」。
- 关于页：站点说明 + 图源与授权说明。

### 3.4 动效
- 克制的入场淡入；hover 浮层过渡 0.2s；弹层缩放淡入。
- 尊重 `prefers-reduced-motion`。

## 4. 信息架构与路由

单页应用（React Router）：
- `/` 首页：hero + 分类条 + 瀑布流。
- `/category/:slug` 分类视图（与首页同布局，路由联动筛选）。
- `/search?q=...` 搜索结果视图。
- `/about` 关于页。
- 详情弹层基于当前列表（不占路由，关闭后回到原位置）。

分类 slug → Openverse 查询关键词映射：
| 分类 | slug | 关键词 |
|---|---|---|
| 雷暴 | thunderstorm | lightning storm thunderstorm |
| 彩虹 | rainbow | rainbow |
| 雪 | snow | snow snowfall winter storm |
| 雾 | fog | fog foggy mist |
| 极光 | aurora | aurora northern lights |
| 云海 | clouds | clouds sea of clouds sunrise clouds |
| 台风 | typhoon | typhoon hurricane storm clouds |

## 5. 技术架构

### 5.1 技术栈
- React 18 + Vite + React Router DOM。
- 纯前端静态站点，无后端；可部署至 GitHub Pages / Vercel 等静态托管。
- CSS：原生 CSS + 变量 token（单一 `tokens.css`），组件级 CSS（BEM 或 CSS Modules）。

### 5.2 目录结构（规划）
```
src/
  main.jsx / App.jsx        # 入口与路由
  styles/tokens.css         # 设计令牌
  api/openverse.js          # Openverse 客户端（查询、分页、超时、降级）
  data/curated.js           # 内置精选集
  data/categories.js        # 分类配置与关键词映射
  hooks/usePhotos.js        # 列表状态机（loading/error/data/降级）
  components/
    Header / SearchBox / Hero / CategoryRail / MasonryGrid / PhotoCard / Lightbox / Skeleton / Footer / SourceBadge
  pages/
    Home / Category / Search / About
```

### 5.3 数据流
1. 页面挂载 → `usePhotos(category|query)`。
2. 有缓存则直接渲染；否则请求 Openverse（带 AbortController 8s 超时）。
3. 成功 → 标准化为内部 Photo 模型：`{ id, title, photographer, source, license, url, thumbnail, original }`。
4. 失败 / 空结果 → 从内置精选集按分类过滤 / 全量降级，并标记 `degraded: true`，UI 显示来源徽标。
5. 无限滚动 → 下一页请求，追加列表；降级模式不再分页。

### 5.4 错误处理
- 网络错误：静默降级 + 非阻塞提示（「当前使用内置精选」）。
- 图片加载失败：占位背景 + 重试/移除。
- 搜索无结果：空状态文案 + 返回精选建议。
- 分类无数据：显示内置集合并标注来源。

## 6. 测试与验收
1. 构建检查：`npm run build` 通过，无控制台错误。
2. 浏览器验证：桌面 + 移动端视口；核心链路（首页 → 分类 → 搜索 → 详情 → 无限滚动 → 降级）逐一走查。
3. 设计还原：概念图 ↔ 实现截图逐项对比（色彩、排版、间距、容器模型、动效），达到签字验收级。
4. 交互真实性：实时聚合加载、降级切换、骨架屏均需实际生效，不做假交互。

## 7. 交付物
- 可运行的 React + Vite 项目（含设计令牌、组件、数据层）。
- 内置精选集与 Openverse 客户端（含降级逻辑）。
- README：本地运行、部署、图源与授权说明。
