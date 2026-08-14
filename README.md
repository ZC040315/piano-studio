# STORMCAP · 全网天气摄影画廊

聚合全网开放图库天气摄影的沉浸式画廊网站：雷暴、彩虹、雪、雾、极光、云海、台风，捕捉天空的瞬息万变。

![首页](.superpowers/qa/01-home.png)

## 功能

- **全网实时聚合**：图源优先级 Openverse（Flickr / Wikimedia / WordPress）→ Wikimedia Commons 直连 → 内置精选。
- **分类浏览**：全部 / 雷暴 / 彩虹 / 雪 / 雾 / 极光 / 云海 / 台风。
- **关键词搜索**：支持“地点 + 现象”，如「冰岛 极光」。
- **图片详情弹层**：摄影师、来源图库、授权信息、查看原图（跳转原始页面）。
- **瀑布流 + 无限滚动**，深色杂志感视觉（Dark Storm）。
- **降级兜底**：开放图库不可用时自动切换内置精选集（12 张 CC 天气摄影，本地打包）。

## 本地运行

```bash
npm install
npm run dev
```

打开 http://localhost:5173 。

## 构建与部署

```bash
npm run build
```

产物在 `dist/`，可部署到任何静态托管（GitHub Pages、Vercel、Netlify 等）。

## 测试

```bash
npm test
```

覆盖 Openverse / Wikimedia Commons 响应解析与列表状态机（含降级逻辑）。

## 图源与授权

- 在线聚合：Openverse API（[api.openverse.org](https://api.openverse.org)）聚合 Flickr、Wikimedia Commons、WordPress 图库的 CC 授权图片；不可用时直连 Wikimedia Commons API 检索。
- 内置精选：12 张图片来自 [Wikimedia Commons](https://commons.wikimedia.org)，均随包分发并保留作者与授权信息（详见 `src/data/curated.js`）。
- 所有图片版权归原作者所有，使用遵循各自标注的 CC 授权；站点仅作聚合展示与索引。

## 目录结构

```
src/
  api/          # Openverse 与 Wikimedia Commons 客户端
  data/         # 分类配置与内置精选集
  hooks/        # usePhotos 状态机、无限滚动
  lib/          # Photo 模型与兜底合并、列表 reducer
  components/   # Header/Hero/瀑布流/弹层等 UI 组件
  pages/        # 首页 / 分类 / 搜索 / 关于
  styles/       # 设计令牌（tokens.css）与全局、组件、页面样式
public/assets/  # 内置精选图片
```
