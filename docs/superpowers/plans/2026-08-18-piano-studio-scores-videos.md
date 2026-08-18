# Piano Studio 曲谱库与教学视频 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为 Piano Studio 新增 24 课每课 B 站教学视频区，以及 30 首曲目的「曲谱库」页面（复用现有跟练组件）。

**Architecture:** 全部沿用现有 Vite + React 结构。视频 = 课程数据加 `video` 字段 + `VideoBlock` 组件（B 站 iframe）。曲谱库 = `src/data/scores.js` 数据 + `/scores` 列表页 + `/scores/:id` 详情页（复用 `Practice`）。解析器增加 `#`/`b` 变音记号支持（致爱丽丝等曲目需要）。

**Tech Stack:** React 18 + Vite 8 + React Router DOM 7 + Vitest；原生 CSS。

## Global Constraints

- 界面与文案全部简体中文；沿用现有设计令牌与 `components.css` 风格。
- 项目根目录：`piano-studio/`；新增文件全部在该目录内。
- 简谱字符串格式沿用现有约定（`1`–`7`、`0` 休止、`'`/`,` 八度、`-` 延长、`_` 半拍、`.` 附点、`[ ]` 和弦），本次扩展 `#`（升号）与 `b`（降号）写在数字后，如 `2#`=D#、`5#`=G#、`b7`=Bb。
- 练习音域 C3–E5（MIDI 48–76）；含变音记号的音符也必须落在该范围。
- 曲目数据中 `notes: null` 表示「待校对」，详情页显示占位说明，列表页显示「待校对」徽标。
- 视频字段 `video: { bvid: string|null, aid: number|null, title: string }`；两者至少其一存在才嵌入，否则显示「视频待补充」。
- 每完成一个 Task 提交一次 git commit（`feat:`/`test:`/`docs:` 前缀）。

---

### Task 1: 解析器扩展：变音记号 # / b

**Files:**
- Modify: `piano-studio/src/lib/notes.js`
- Modify: `piano-studio/src/lib/notes.test.js`

**Interfaces:**
- Consumes: 现有 `parseExercise` / `STEP_TO_SEMITONE` / `midiToFreq`。
- Produces: `parseExercise` 支持数字后 `#`（+1 半音）与 `b`（-1 半音），单音与和弦均可；解析结果 `label` 保留原始记号文本（如 `2#`）。

- [ ] **Step 1: 追加失败测试**

在 `piano-studio/src/lib/notes.test.js` 追加：

```js
it('解析升号与降号', () => {
  const out = parseExercise('3 2# 3 2# 3 7 2 1 6 | 1 3 6 7 3 5# 7 1\'')
  expect(out.map((n) => n.midi)).toEqual([64, 63, 64, 63, 64, 71, 62, 60, 69, 60, 64, 69, 71, 64, 68, 71, 72])
  expect(out[1].label).toBe('2#')
  expect(parseExercise('b7')[0].midi).toBe(70)
})
```

- [ ] **Step 2: 运行测试确认失败**

运行 `npx vitest run src/lib/notes.test.js`。预期：新增用例 FAIL（`2#` 当前被丢弃）。

- [ ] **Step 3: 修改 notes.js**

单音正则改为 `^([0-7])([' ,#b]*)([-_.]*)$`；和弦正则改为 `^([0-7',#b]+)$`。解析逻辑：遍历记号串，`'`/`,` 累计八度，`#` 置 `acc=1`，`b` 置 `acc=-1`；`midi = 60 + STEP_TO_SEMITONE[step] + acc + oct*12`。`label` 直接返回 `m[1] + m[2]`（单音）或逐音拼接（和弦，变音记号随数字）。

```js
function parseSingleToken(token) {
  if (token.startsWith('[')) {
    const close = token.indexOf(']')
    if (close === -1) return null
    const inner = token.slice(1, close)
    const suffix = token.slice(close + 1)
    const m = inner.match(/^([0-7',#b]+)$/)
    if (!m) return null
    const midis = []
    const chordLabels = []
    let i = 0
    while (i < m[1].length) {
      const ch = m[1][i]
      i += 1
      if (ch === '0') { chordLabels.push('0'); continue }
      const step = Number(ch)
      let oct = 0
      let acc = 0
      let label = ch
      while (i < m[1].length && "',#b".includes(m[1][i])) {
        if (m[1][i] === "'") oct += 1
        else if (m[1][i] === ',') oct -= 1
        else if (m[1][i] === '#') acc += 1
        else if (m[1][i] === 'b') acc -= 1
        label += m[1][i]
        i += 1
      }
      midis.push(60 + STEP_TO_SEMITONE[step] + acc + oct * 12)
      chordLabels.push(label)
    }
    return { midi: null, beats: beatsFromSuffix(suffix), chord: midis, chordLabels, label: chordLabels.join('') }
  }

  const m = token.match(/^([0-7])([' ,#b]*)([-_.]*)$/)
  if (!m) return null
  const step = Number(m[1])
  let oct = 0
  let acc = 0
  for (const c of m[2]) {
    if (c === "'") oct += 1
    else if (c === ',') oct -= 1
    else if (c === '#') acc += 1
    else if (c === 'b') acc -= 1
  }
  if (step === 0) {
    return { midi: null, beats: beatsFromSuffix(m[3]), chord: null, chordLabels: null, label: '0' }
  }
  return { midi: 60 + STEP_TO_SEMITONE[step] + acc + oct * 12, beats: beatsFromSuffix(m[3]), chord: null, chordLabels: null, label: m[1] + m[2] }
}
```

- [ ] **Step 4: 运行测试确认通过**

运行 `npx vitest run src/lib/notes.test.js`。预期：全部 PASS（含新增用例）。

- [ ] **Step 5: Commit**

```bash
git add piano-studio/src/lib/notes.js piano-studio/src/lib/notes.test.js
git commit -m "feat: support sharp and flat accidentals in numbered notation parser"
```

---

### Task 2: 曲谱数据（30 首）与完整性测试

**Files:**
- Create: `piano-studio/src/data/scores.js`
- Create: `piano-studio/src/data/scores.test.js`

**Interfaces:**
- Produces: `scores`（30 项，字段 `{ id, title, artist, category: 'pop'|'instrumental', difficulty: 1|2|3, notes: string|null, sourceNote: string|null }`）；`getScore(id) => score|null`；`getScoreNotes(id) => ExerciseNote[]|null`（内部 `parseExercise` + 缓存，`notes` 为空返回 `null`）。

- [ ] **Step 1: 写失败测试**

`piano-studio/src/data/scores.test.js`：

```js
import { describe, it, expect } from 'vitest'
import { scores, getScore, getScoreNotes } from './scores.js'

describe('曲谱数据', () => {
  it('共 30 首且 id 唯一', () => {
    expect(scores).toHaveLength(30)
    expect(new Set(scores.map((s) => s.id)).size).toBe(30)
  })

  it('分类与难度合法', () => {
    for (const s of scores) {
      expect(['pop', 'instrumental']).toContain(s.category)
      expect([1, 2, 3]).toContain(s.difficulty)
    }
  })

  it('至少 10 首可直接跟练', () => {
    expect(scores.filter((s) => s.notes).length).toBeGreaterThanOrEqual(10)
  })

  it('有 notes 的曲目可解析且音域合法', () => {
    for (const s of scores) {
      if (!s.notes) continue
      const notes = getScoreNotes(s.id)
      expect(notes.length).toBeGreaterThan(0)
      for (const n of notes) {
        const midis = n.chord ?? (n.midi !== null ? [n.midi] : [])
        for (const m of midis) {
          expect(m).toBeGreaterThanOrEqual(48)
          expect(m).toBeLessThanOrEqual(76)
        }
      }
    }
  })

  it('getScore 命中与未命中', () => {
    expect(getScore('score-01').title).toBe('虫儿飞')
    expect(getScore('nope')).toBeNull()
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

运行 `npx vitest run src/data/scores.test.js`。预期：FAIL（模块不存在）。

- [ ] **Step 3: 创建 scores.js**

```js
import { parseExercise } from '../lib/notes.js'

const cache = new Map()

export const scores = [
  // —— 流行歌曲 ——
  { id: 'score-01', title: '虫儿飞', artist: '郑伊健', category: 'pop', difficulty: 1, notes: '3 3 3 4 5 3 2 2 | 1 1 1 2 3 3 7, 7, | 3 3 3 4 5 3 2 2 | 1 1 1 2 3 3 7, 7,', sourceNote: '简化改编，参考公开数字谱' },
  { id: 'score-02', title: '茉莉花', artist: '江苏民歌', category: 'pop', difficulty: 1, notes: '3 3 5 6 1\' 1\' 6 | 5 6 5 - - - | 3 3 5 6 1\' 1\' 6 | 5 6 5 - - - | 5 5 6 1\' 6 5 3 2 | 3 5 6 1\' 6 5 3 2 | 1\' 6 5 6 5 3 2 | 1 - - -', sourceNote: '简化改编，参考公开简谱' },
  { id: 'score-03', title: '月亮代表我的心', artist: '邓丽君', category: 'pop', difficulty: 2, notes: '5 1 3 2 1 | 5 6 5 3 2 | 1 3 2 1 6 | 5 3 5 2- | 5 1 3 2 1 | 5 6 5 3 2 | 1 3 2 1 2 | 1- - -', sourceNote: '简化改编，与课程第 23 课同款' },
  { id: 'score-04', title: '童话', artist: '光良', category: 'pop', difficulty: 2, notes: null, sourceNote: '待校对：暂未找到可靠数字谱' },
  { id: 'score-05', title: '小幸运', artist: '田馥甄', category: 'pop', difficulty: 2, notes: '1 3 5 6 5 3 1 | 2 3 5 6 5 3 1 | 5 6 5 3 2 3 5 | 6 5 3 2 3 5 6 | 5 3 2 1 - - -', sourceNote: '简化改编，参考公开 C 大调版本' },
  { id: 'score-06', title: '告白气球', artist: '周杰伦', category: 'pop', difficulty: 2, notes: null, sourceNote: '待校对：暂未找到可靠数字谱' },
  { id: 'score-07', title: '海阔天空', artist: 'Beyond', category: 'pop', difficulty: 3, notes: '3 2 1 | 2 3 5 5 5 5 6 5 | 6 7 1\' 1\' 1\' 1\' 1\' 7 6 5 6 | 6 5 5 | 5 3 2 1 | 3 4 3 2 2 3 2 2 | 3 2 2 2 1 1 1 1 | 2 1 1', sourceNote: '简化改编，参考社区数字谱' },
  { id: 'score-08', title: '青花瓷', artist: '周杰伦', category: 'pop', difficulty: 3, notes: '3 5 6 5 3 2 1 2 | 3 5 6 5 3 2 1 2 | 3 5 6 1\' 6 5 3 2 | 3 5 6 1\' 6 5 3 2 | 3 2 1 - - -', sourceNote: '简化改编，参考公开示例旋律' },

  // —— 热门钢琴纯音乐 ——
  { id: 'score-09', title: '卡农 Canon in D', artist: '帕赫贝尔', category: 'instrumental', difficulty: 2, notes: '3 2 1 7 6 5 6 1\' | 7 6 5 4 3 2 3 5 | 1\' 7 6 5 4 3 4 6 | 2 1\' 7 6 5 4 5 7 | 3 2 1 7 6 5 6 1\' | 7 6 5 4 3 2 3 5 | 1\' 7 6 5 4 3 4 6 | 5 - - -', sourceNote: 'C 大调简化改编' },
  { id: 'score-10', title: '致爱丽丝 Für Elise', artist: '贝多芬', category: 'instrumental', difficulty: 2, notes: '3 2# 3 2# 3 7 2 1 6 | 1 3 6 7 3 5# 7 1\' | 3 2# 3 2# 3 7 2 1 6 | 1 3 6 7 3 7 6', sourceNote: '简化改编（含变音记号），参考公开数字谱' },
  { id: 'score-11', title: '梦中的婚礼 Mariage d\'Amour', artist: '理查德·克莱德曼', category: 'instrumental', difficulty: 2, notes: '6 6 7 7 1\' 1\' 7 7 | 6 6 3 3 1\' 1\' 5 5 | 4 4 3 4 5 4 3 2 | 1 2 3 4 3 2 1 -', sourceNote: '简化改编，参考社区入门版' },
  { id: 'score-12', title: '天空之城', artist: '久石让', category: 'instrumental', difficulty: 2, notes: '6 7 1\' 7 1\' 3\' 7 | 3\' 6 5 6 1\' 5 | 3 3 4 3 4 1\' 3 | 1\' 7 6 7 6 - | 6 7 1\' 7 1\' 3\' 7 | 3\' 6 5 6 1\' 5 | 3 3 4 3 4 1\' 3 | 1\' 7 6 7 6 -', sourceNote: 'C 大调简化改编，参考公开简谱' },
  { id: 'score-13', title: '菊次郎的夏天 Summer', artist: '久石让', category: 'instrumental', difficulty: 2, notes: null, sourceNote: '待校对：暂未找到可靠数字谱' },
  { id: 'score-14', title: 'River Flows in You', artist: '李闰珉', category: 'instrumental', difficulty: 2, notes: '7 6 7 6 7 3\' 7 3\' | 2\' - 6 1\' 7 - | 7 6 7 6 7 3\' 7 3\' | 2\' - 6 1\' 7 -', sourceNote: '简化改编，参考公开简谱' },
  { id: 'score-15', title: 'Kiss the Rain 雨的印记', artist: '李闰珉', category: 'instrumental', difficulty: 3, notes: null, sourceNote: '待校对：暂未找到可靠数字谱' },
  { id: 'score-16', title: '夜的钢琴曲五', artist: '石进', category: 'instrumental', difficulty: 3, notes: '6 7 1\' 3\' 6\' - | 6 7 1\' 3\' 6\' - | 2\' 1\' 7 1\' 6 - | 3 5 6 3\' 5 3 5 2\' 1\' -', sourceNote: '简化改编，参考社区简谱' },

  // —— 用户点名曲目 ——
  { id: 'score-17', title: 'Ahead of Us (Piano Version)', artist: 'Akira Kosemura', category: 'instrumental', difficulty: 2, notes: null, sourceNote: '待校对：暂未找到可靠数字谱' },
  { id: 'score-18', title: 'A Little Story', artist: 'Valentin', category: 'instrumental', difficulty: 2, notes: null, sourceNote: '待校对：暂未找到可靠数字谱' },
  { id: 'score-19', title: 'Sacred Play Secret Place', artist: 'Matryoshka', category: 'instrumental', difficulty: 2, notes: null, sourceNote: '待校对：暂未找到可靠数字谱' },
  { id: 'score-20', title: '三葉のテーマ', artist: 'RADWIMPS', category: 'instrumental', difficulty: 2, notes: null, sourceNote: '待校对：暂未找到可靠数字谱' },
  { id: 'score-21', title: '不重逢（钢琴版）', artist: '华晨宇', category: 'instrumental', difficulty: 3, notes: null, sourceNote: '待校对：暂未找到可靠数字谱' },
  { id: 'score-22', title: 'Secret（Piano）', artist: '周杰伦', category: 'instrumental', difficulty: 3, notes: null, sourceNote: '待校对：暂未找到可靠数字谱' },
  { id: 'score-23', title: 'Counter Attack（钢琴版）', artist: 'Samuel Kim', category: 'instrumental', difficulty: 3, notes: null, sourceNote: '待校对：暂未找到可靠数字谱' },
  { id: 'score-24', title: 'The Truth That You Leave', artist: 'Pianoboy 高至豪', category: 'instrumental', difficulty: 2, notes: null, sourceNote: '待校对：暂未找到可靠数字谱' },
  { id: 'score-25', title: 'So Far Away (Acoustic)', artist: 'Martin Garrix', category: 'instrumental', difficulty: 3, notes: null, sourceNote: '待校对：暂未找到可靠数字谱' },
  { id: 'score-26', title: 'Amnesia', artist: '5 Seconds of Summer', category: 'instrumental', difficulty: 2, notes: null, sourceNote: '待校对：暂未找到可靠数字谱' },
  { id: 'score-27', title: '原来', artist: '南征北战NZBZ', category: 'instrumental', difficulty: 2, notes: null, sourceNote: '待校对：暂未找到可靠数字谱' },
  { id: 'score-28', title: 'The Way I Still Love You', artist: 'Reynard Silva', category: 'instrumental', difficulty: 2, notes: null, sourceNote: '待校对：暂未找到可靠数字谱' },
  { id: 'score-29', title: 'Shadow of the Sun', artist: 'Max Elto', category: 'instrumental', difficulty: 2, notes: null, sourceNote: '待校对：暂未找到可靠数字谱' },
  { id: 'score-30', title: 'Angel', artist: 'George Winston', category: 'instrumental', difficulty: 2, notes: null, sourceNote: '待校对：暂未找到可靠数字谱' },
]

export function getScore(id) {
  return scores.find((s) => s.id === id) ?? null
}

export function getScoreNotes(id) {
  const score = getScore(id)
  if (!score?.notes) return null
  if (!cache.has(id)) cache.set(id, parseExercise(score.notes))
  return cache.get(id)
}
```

- [ ] **Step 4: 运行测试确认通过**

运行 `npx vitest run src/data/scores.test.js`。预期：PASS。

- [ ] **Step 5: Commit**

```bash
git add piano-studio/src/data/scores.js piano-studio/src/data/scores.test.js
git commit -m "feat: add 30-piece score library data with verification tests"
```

---

### Task 3: 课程视频字段与 VideoBlock 组件

**Files:**
- Create: `piano-studio/src/components/VideoBlock.jsx`
- Modify: `piano-studio/src/data/lessons.js`（24 课各加 `video` 字段）
- Modify: `piano-studio/src/pages/LessonPage.jsx`（渲染视频区）
- Modify: `piano-studio/src/styles/components.css`（视频样式）

**Interfaces:**
- Consumes: `lessons`（新增 `video` 字段）。
- Produces: `VideoBlock({ video })`：`video.bvid` 或 `video.aid` 存在时渲染 B 站 iframe + 标题；否则渲染「视频待补充」占位卡。

- [ ] **Step 1: 实现 VideoBlock**

`piano-studio/src/components/VideoBlock.jsx`：

```jsx
export default function VideoBlock({ video }) {
  const src = video?.bvid
    ? `https://player.bilibili.com/player.html?bvid=${video.bvid}&page=1&high_quality=1&danmaku=0`
    : video?.aid
      ? `https://player.bilibili.com/player.html?aid=${video.aid}&page=1&high_quality=1&danmaku=0`
      : null
  if (!src) {
    return (
      <section className="video-block card video-pending">
        <h2>视频教学</h2>
        <p>视频待补充</p>
        <p className="muted">这里会放一节讲解视频，正在挑选合适的免费教程。</p>
      </section>
    )
  }
  return (
    <section className="video-block card">
      <h2>视频教学</h2>
      <div className="video-frame">
        <iframe
          src={src}
          title={video.title}
          loading="lazy"
          allowFullScreen
          scrolling="no"
          frameBorder="0"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <p className="video-title">{video.title}</p>
      <p className="muted">建议先看视频示范，再回到下方跟练键盘练习。</p>
    </section>
  )
}
```

- [ ] **Step 2: 给 24 课添加 video 字段**

在 `lessons.js` 每课对象内追加 `video`（在 `exerciseIds` 之后）。已找到的 B 站视频：

| 课程 | video |
|---|---|
| lesson-01 认识键盘 | `{ bvid: 'BV1jL411w78B', aid: null, title: '新手钢琴入门教学：认识琴键和中央 C' }` |
| lesson-02 坐姿手型 | `{ bvid: 'BV1x81EByE1k', aid: null, title: '从零开始精通钢琴：坐姿与手型' }` |
| lesson-04 简谱入门 | `{ bvid: 'BV1Y1CYYYEti', aid: null, title: '流行键盘弹唱教学：认识简谱' }` |
| lesson-08 小星星 | `{ bvid: 'BV1KcpfeoELo', aid: null, title: '零基础学钢琴《小星星》简谱教学' }` |
| lesson-09 音阶 | `{ bvid: null, aid: 668901910, title: 'C 大调与 a 小调音阶练习方法及指法' }` |
| lesson-13 欢乐颂 | `{ bvid: 'BV1wZ421b7ez', aid: null, title: '零基础学钢琴《欢乐颂》简谱教学' }` |
| lesson-17 三和弦 | `{ bvid: 'BV13841177Rg', aid: null, title: '钢琴即兴伴奏：万能和弦教学' }` |
| lesson-19 分解和弦 | `{ bvid: 'BV12vbC6uEFb', aid: null, title: '0 基础钢琴课堂：分解练习' }` |
| lesson-23 月亮代表我的心 | `{ bvid: 'BV1kNe2zNEJW', aid: null, title: '零基础学钢琴《月亮代表我的心》简谱教学' }` |

其余 15 课（3、5、6、7、10、11、12、14、15、16、18、20、21、22、24）用 `{ bvid: null, aid: null, title: '' }`。

- [ ] **Step 3: LessonPage 渲染视频区**

在「学习目标」卡片与「跟练练习」标题之间插入：

```jsx
<VideoBlock video={lesson.video} />
```

并在文件顶部导入 `VideoBlock`。

- [ ] **Step 4: 样式**

在 `components.css` 追加：

```css
.video-block { margin: 18px 0; }
.video-block h2 { margin-top: 0; }
.video-frame {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  border-radius: var(--radius-inner);
  overflow: hidden;
  background: var(--surface-warm);
}
.video-frame iframe {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
.video-title { font-weight: 700; margin: 10px 0 4px; }
.video-pending { background: var(--surface-warm); border-style: dashed; text-align: center; }
```

- [ ] **Step 5: 验证构建**

运行 `npm run build`。预期：成功。

- [ ] **Step 6: Commit**

```bash
git add piano-studio/src/components/VideoBlock.jsx piano-studio/src/data/lessons.js piano-studio/src/pages/LessonPage.jsx piano-studio/src/styles/components.css
git commit -m "feat: embed Bilibili lesson videos with pending placeholder"
```

---

### Task 4: 曲谱库页面（列表 + 详情 + 入口）

**Files:**
- Create: `piano-studio/src/pages/ScoresPage.jsx`
- Create: `piano-studio/src/pages/ScorePage.jsx`
- Modify: `piano-studio/src/App.jsx`（路由）
- Modify: `piano-studio/src/components/Header.jsx`（导航）
- Modify: `piano-studio/src/pages/HomePage.jsx`（入口卡片）
- Modify: `piano-studio/src/components/Practice.jsx`（支持传入已解析 notes）
- Modify: `piano-studio/src/styles/components.css`

**Interfaces:**
- Consumes: `scores`/`getScore`/`getScoreNotes`、`Practice`、`SheetDisplay` 无关（跟练直接复用）。
- Produces: `ScoresPage`（分类筛选 + 难度星级 + 待校对徽标）、`ScorePage`（详情 + 跟练或待校对占位）。

- [ ] **Step 1: Practice 支持 notes 属性**

修改 `Practice.jsx`：新增可选 `notesProp`，有值则优先使用：

```jsx
const notes = useMemo(
  () => notesProp ?? getExerciseNotes(exerciseId),
  [exerciseId, notesProp],
)
```

函数签名改为 `Practice({ exerciseId, notesProp, onComplete })`。

- [ ] **Step 2: 实现 ScoresPage**

`piano-studio/src/pages/ScoresPage.jsx`：

```jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { scores } from '../data/scores.js'

const FILTERS = [
  { key: 'all', label: '全部' },
  { key: 'pop', label: '流行歌曲' },
  { key: 'instrumental', label: '钢琴纯音乐' },
]

export default function ScoresPage() {
  const [filter, setFilter] = useState('all')
  const list = scores
    .filter((s) => filter === 'all' || s.category === filter)
    .sort((a, b) => a.difficulty - b.difficulty || a.id.localeCompare(b.id))

  return (
    <main className="page scores-page">
      <h1>曲谱库</h1>
      <p className="muted">30 首流行歌曲与纯音乐简谱，均标注「简化改编 · 仅供学习」；「待校对」曲目暂时无法跟练。</p>
      <div className="filter-tabs">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            className={`filter-tab${filter === f.key ? ' is-active' : ''}`}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>
      <div className="lesson-grid">
        {list.map((s) => (
          <Link key={s.id} to={`/scores/${s.id}`} className="card lesson-card">
            <span className="lesson-no">{s.category === 'pop' ? '流行' : '纯音乐'} · {'★'.repeat(s.difficulty)}{'☆'.repeat(3 - s.difficulty)}</span>
            <h3>{s.title}</h3>
            <p>{s.artist}</p>
            {!s.notes && <span className="pending-badge">待校对</span>}
          </Link>
        ))}
      </div>
    </main>
  )
}
```

- [ ] **Step 3: 实现 ScorePage**

`piano-studio/src/pages/ScorePage.jsx`：

```jsx
import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getScore, getScoreNotes } from '../data/scores.js'
import Practice from '../components/Practice.jsx'

export default function ScorePage() {
  const { id } = useParams()
  const score = getScore(id)
  const notes = useMemo(() => (score ? getScoreNotes(score.id) : null), [score])

  if (!score) {
    return (
      <main className="page">
        <h1>曲目不存在</h1>
        <Link className="btn" to="/scores">返回曲谱库</Link>
      </main>
    )
  }

  return (
    <main className="page score-page">
      <Link to="/scores" className="back-link">← 返回曲谱库</Link>
      <h1>{score.title}</h1>
      <p className="muted">{score.artist} · {score.category === 'pop' ? '流行歌曲' : '钢琴纯音乐'} · 难度 {'★'.repeat(score.difficulty)}{'☆'.repeat(3 - score.difficulty)}</p>
      {score.sourceNote && <p className="source-note">来源说明：{score.sourceNote}</p>}
      <p className="muted">简化改编 · 仅供学习</p>
      {notes ? (
        <Practice notesProp={notes} exerciseId={null} />
      ) : (
        <section className="card pending-card">
          <h2>待校对</h2>
          <p>这首曲子的简谱还在校对中，暂时无法跟练。如果你有可靠的谱面，可以发给我们补全。</p>
        </section>
      )}
    </main>
  )
}
```

- [ ] **Step 4: 路由与导航入口**

`App.jsx` 增加：

```jsx
import ScoresPage from './pages/ScoresPage.jsx'
import ScorePage from './pages/ScorePage.jsx'
// ...
<Route path="/scores" element={<ScoresPage />} />
<Route path="/scores/:id" element={<ScorePage />} />
```

`Header.jsx` 导航在「课程」与「学习指南」之间加 `<NavLink to="/scores">曲谱库</NavLink>`。

`HomePage.jsx` 在「继续学习」卡片之后追加入口：

```jsx
<section className="scores-entry card">
  <h2>曲谱库</h2>
  <p>30 首流行歌曲与纯音乐简谱，点开就能跟练。</p>
  <Link className="btn" to="/scores">打开曲谱库</Link>
</section>
```

- [ ] **Step 5: 样式**

`components.css` 追加：`.filter-tabs`（flex 胶囊组）、`.filter-tab`（与 `.btn-ghost` 同款，`.is-active` 用 `--wood` 填充白字）、`.pending-badge`（琥珀色胶囊，复用 `.done-badge` 定位）、`.source-note`（琥珀色小字）、`.scores-entry`（首页卡片）、`.pending-card`（居中虚线边框）。

- [ ] **Step 6: 验证构建**

运行 `npm run build`。预期：成功。

- [ ] **Step 7: Commit**

```bash
git add piano-studio/src/pages/ScoresPage.jsx piano-studio/src/pages/ScorePage.jsx piano-studio/src/App.jsx piano-studio/src/components/Header.jsx piano-studio/src/components/Practice.jsx piano-studio/src/pages/HomePage.jsx piano-studio/src/styles/components.css
git commit -m "feat: build scores library pages with filtering and play-along"
```

---

### Task 5: README、全量测试、构建与浏览器走查

**Files:**
- Modify: `piano-studio/README.md`
- Modify: 修复走查发现的问题

- [ ] **Step 1: 更新 README**

在「功能」追加：每课 B 站视频教学区；曲谱库 30 首（流行 + 纯音乐，复用跟练）。在「曲目与版权说明」追加：曲谱库全部标注「简化改编 · 仅供学习」，部分曲目标记「待校对」；B 站视频为公开免费教程，版权归原作者。

- [ ] **Step 2: 全量测试**

运行 `npm test`。预期：notes / progress / practice / keys / data / scores 全部 PASS。

- [ ] **Step 3: 构建**

运行 `npm run build`。预期：成功。

- [ ] **Step 4: 浏览器走查（桌面 + 移动）**

运行 `npm run dev`（端口 5174），用 Playwright（复用根目录 `playwright-core` + 本机 Chrome）走查：
- 导航 → 曲谱库 → 分类筛选（全部/流行/纯音乐）→ 打开《虫儿飞》→ 按键 `a s s s d f s s` 跟练完成 → 返回列表。
- 打开一篇「待校对」曲目（如 score-04 童话）→ 显示待校对占位。
- 课程第 1 课 → 视频区 iframe 存在；第 3 课 → 显示「视频待补充」。
- 移动端（375×667）：曲谱库与课程详情无横向溢出。
- 修复发现的问题后重新测试、构建、再走查。

- [ ] **Step 5: Commit**

```bash
git add piano-studio/README.md
git commit -m "docs: document scores library and lesson videos"
```

---

### Task 6: 合并 master 并部署

- [ ] **Step 1: 合并**

```bash
git checkout master
git merge --ff-only codex/scores-videos
```

- [ ] **Step 2: 推送**

用 GitHub 令牌 Basic 认证推送 master（触发 Pages Actions 自动部署）。

- [ ] **Step 3: 验证线上**

轮询 Actions 直到 `success`，然后验证 `https://zc040315.github.io/piano-studio/scores` 与 `https://zc040315.github.io/piano-studio/lessons/lesson-01` 返回应用页面。

---

## Self-Review 结论

- 设计文档逐项覆盖：视频（Task 3）、曲谱库 30 首（Task 2、4）、待校对流程（scores.js 的 `sourceNote` + UI 徽标）、测试与走查（Task 5）、部署（Task 6）。
- 变音记号支持与致爱丽丝数据一致（`2#`/`5#`）；音域断言覆盖变音音（68 在 48–76 内）。
- `Practice` 接口扩展向后兼容（`exerciseId` 仍可用）；`getScoreNotes` 返回类型与 `getExerciseNotes` 一致。
