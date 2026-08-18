# Piano Studio 扩展：教学视频与曲谱库 设计文档

日期：2026-08-18
状态：已获用户确认

## 1. 背景与目标

在已上线的 Piano Studio（24 课零基础钢琴自学网站）基础上新增两块内容：

1. **教学视频**：为 24 课每课配一个 B 站公开免费教学视频，嵌入课程详情页，帮助用户看到真人演示。
2. **曲谱库**：新增 30 首流行歌曲与热门钢琴纯音乐的简化简谱，独立成页，每首带跟练键盘（与课程同一套交互）。

成功标准：
- 24 课每课详情页顶部出现视频教学区（找不到合适视频的课显示「待补充」占位，不硬塞不相关视频）。
- 曲谱库 30 首全部可通过导航访问；每首有简谱、高亮跟练、演示播放，与课程体验一致。
- 曲谱音符经过查证，不做凭印象瞎编；查不到可靠来源的曲目不收录或明确标注「待校对」。
- 新增页面在桌面与移动端无布局问题；全量测试与构建通过。

## 2. 范围（已确认）

### 2.1 教学视频
- 课程数据 `lessons.js` 每课新增 `video` 字段：`{ bvid: string|null, title: string }`。
- 新组件 `VideoBlock.jsx`：嵌入 B 站播放器（`https://player.bilibili.com/player.html?bvid=<bvid>&page=1`），含标题与使用提示；`bvid` 为空或加载失败时显示「视频待补充」占位。
- 课程详情页在「学习目标」卡片之后、「跟练练习」之前渲染视频区。
- 视频来源：实现阶段联网搜索 B 站公开免费教程（认键、手型、简谱、对应曲目），优先播放量与匹配度；无合适视频的课程 `bvid: null`。

### 2.2 曲谱库（30 首）

曲目清单（已与用户确认）：

流行歌曲（8 首）：
1. 虫儿飞（难度 1）
2. 茉莉花（难度 1）
3. 月亮代表我的心（难度 2）
4. 童话（难度 2）
5. 小幸运（难度 2）
6. 告白气球（难度 2）
7. 海阔天空（难度 3）
8. 青花瓷（难度 3）

热门钢琴纯音乐（8 首）：
9. 卡农 Canon in D（难度 2）
10. 致爱丽丝 Für Elise（难度 2）
11. 梦中的婚礼 Mariage d'Amour（难度 2）
12. 天空之城（难度 2）
13. 菊次郎的夏天 Summer（难度 2）
14. River Flows in You（难度 2）
15. Kiss the Rain（难度 3）
16. 夜的钢琴曲五（难度 3）

用户点名曲目（14 首，难度待定，实现时按实际旋律评估）：
17. Ahead of Us (Piano Version)
18. A Little Story
19. Sacred Play Secret Place
20. 三葉のテーマ（你的名字。）
21. 不重逢（钢琴版）
22. Secret（Piano）
23. Counter Attack（钢琴版）
24. The Truth That You Leave
25. So Far Away (Acoustic)
26. Amnesia
27. 原来
28. The Way I Still Love You
29. Shadow of the Sun
30. Angel

### 2.3 曲谱库页面
- 新路由：`/scores`（列表）、`/scores/:id`（详情）。
- 顶部导航加「曲谱库」；首页加曲谱库入口卡片。
- 数据文件 `src/data/scores.js`：`{ id, title, artist, category: 'pop'|'instrumental', difficulty: 1|2|3, notes, sourceNote? }`。
- 列表页：分类筛选（全部 / 流行 / 纯音乐），按难度升序；卡片显示标题、来源、难度星级。
- 详情页：复用 `Practice` / `SheetDisplay` / `Piano` 组件；标注「简化改编 · 仅供学习」；`sourceNote` 用于「待校对」标记。
- 曲谱准确性流程：实现时对每首联网查证简谱；查不到可靠来源的暂不收录或在页面标「待校对」，并向用户报告清单。

## 3. 不在本期范围

- 专业五线谱显示、左右手分谱、调号切换、导出打印。
- 用户上传视频。
- 曲谱收藏与自定义排序。

## 4. 技术架构

沿用现有 Vite + React 项目（`piano-studio/`）：
- `src/components/VideoBlock.jsx`：B 站 iframe 嵌入 + 占位状态。
- `src/data/scores.js` + `src/data/scores.test.js`：曲谱数据与完整性测试（id 唯一、notes 可解析、音域 C3–E5、难度合法）。
- `src/pages/ScoresPage.jsx`、`src/pages/ScorePage.jsx`；路由与导航在 `App.jsx`、`Header.jsx` 更新。
- `lessons.js` 每课加 `video` 字段；`LessonPage.jsx` 渲染 `VideoBlock`。
- 样式沿用 `components.css` 设计令牌（曲谱库卡片复用 `.lesson-grid` / `.lesson-card` 模式）。

## 5. 测试与验收

1. 单元测试：scores 数据完整性（30 首、id 唯一、notes 可解析、音域合法、难度 1–3、分类合法）；全量 `npm test` 通过。
2. 构建：`npm run build` 通过。
3. 浏览器走查（桌面 + 移动）：导航 → 曲谱库 → 分类筛选 → 曲谱详情跟练（按键/演示/星级）→ 课程详情视频区渲染或占位；无横向溢出。
4. 视频区：有 `bvid` 的课程 iframe 可加载；无 `bvid` 显示「视频待补充」。

## 6. 交付物

- 24 课视频字段与 VideoBlock 组件（含可用的 bvid 集合或「待补充」标注）。
- 30 首曲目数据与曲谱库列表/详情页。
- 首页与导航入口。
- 测试、README 更新、GitHub Pages 重新部署（推送 master 自动触发）。
