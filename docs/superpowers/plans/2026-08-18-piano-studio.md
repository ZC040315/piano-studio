# Piano Studio 零基础钢琴自学网站 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `piano-studio/` 下构建一个独立的 Vite + React 静态网站，为零基础钢琴自学者提供 24 课图文课程与内置跟练键盘（简谱 + 高亮提示 + 演示模式 + 星级进度）。

**Architecture:** 纯前端单页应用。课程与练习是静态数据模块；跟练模式由纯函数 reducer 驱动（lib/practice.js），音色用 Web Audio API 实时合成（lib/audio.js），进度存 localStorage（lib/progress.js）。页面层（Home / Lessons / Lesson / Guide）只负责渲染与路由。

**Tech Stack:** React 18 + Vite 8 + React Router DOM 7 + Vitest；原生 CSS（设计令牌）。

## Global Constraints

- 界面与课程文案全部使用简体中文。
- 项目根目录：`piano-studio/`（与现有 STORMCAP 项目并列，不得改动 STORMCAP 文件）。
- 无后端、无账号；进度只存浏览器 localStorage。
- 设计令牌（tokens.css）：`--bg:#FAF6EF`、`--surface:#FFFFFF`、`--surface-warm:#F3EAE0`、`--ink:#3D3A36`、`--ink-muted:#8A8178`、`--wood:#8B6B52`、`--wood-dark:#6E5340`、`--moss:#6B7A5E`、`--amber:#D9A066`、`--line:rgba(107,94,82,.14)`；卡片圆角 12px、胶囊 999px、内嵌 8px。
- 字体：标题 Noto Serif SC（600–700），正文 Noto Sans SC；均需提供系统字体回退栈。
- 简谱字符串格式（lib/notes.js 解析）：数字 `1`–`7` 或 `0`（休止）；后缀 `'` = 高八度、`,` = 低八度、`.` = 附点（+0.5 拍）、`-` = 延长一拍、`_` = 半拍；`[135]` = 和弦；`|` 与其它非音符 token 忽略。`1` 默认 = MIDI 60（中央 C）。
- 电脑键盘映射（练习区激活时）：`A S D F G H J K` = `1 2 3 4 5 6 7 1'`；黑键 `W E T Y U`。
- 课程 id 命名：`lesson-01` … `lesson-24`。
- 进度 localStorage key：`piano-studio.progress.v1`，结构 `{ completed: { [courseId]: { stars, doneAt } }, lastLessonId }`。
- 每课结构：学习目标 → 图文/动画讲解 → 小节跟练 → 综合跟练曲 → 完成打卡。
- 每完成一个 Task 提交一次 git commit；提交信息用 `feat:` / `test:` / `docs:` 前缀。

---

### Task 1: 脚手架与设计令牌

**Files:**
- Create: `piano-studio/package.json`
- Create: `piano-studio/vite.config.js`
- Create: `piano-studio/index.html`
- Create: `piano-studio/src/main.jsx`
- Create: `piano-studio/src/App.jsx`
- Create: `piano-studio/src/styles/tokens.css`
- Create: `piano-studio/src/styles/global.css`
- Create: `piano-studio/src/pages/HomePage.jsx`
- Create: `piano-studio/src/pages/LessonsPage.jsx`
- Create: `piano-studio/src/pages/LessonPage.jsx`
- Create: `piano-studio/src/pages/GuidePage.jsx`
- Create: `piano-studio/.gitignore`

**Interfaces:**
- Produces: 路由骨架 `/`、`/lessons`、`/lessons/:id`、`/guide`、`*`（404 提示 + 返回首页）；`App.jsx` 导出默认组件；页面组件暂时返回占位标题文本（后续 Task 逐个替换为完整页面）。

- [ ] **Step 1: 创建 package.json**

```json
{
  "name": "piano-studio",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^7.18.2"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^6.0.5",
    "vite": "^8.2.1",
    "vitest": "^4.1.10"
  }
}
```

- [ ] **Step 2: 创建 vite.config.js 与 index.html**

`vite.config.js`：

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
})
```

`index.html`（含 Google Fonts，字体加载失败时回退系统字体）：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Piano Studio · 零基础钢琴自学</title>
    <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='7' fill='%238B6B52'/%3E%3Crect x='4' y='10' width='24' height='15' rx='2' fill='%23FAF6EF'/%3E%3Crect x='7' y='18' width='3' height='7' fill='%233D3A36'/%3E%3Crect x='12' y='18' width='3' height='7' fill='%233D3A36'/%3E%3Crect x='17' y='18' width='3' height='7' fill='%233D3A36'/%3E%3Crect x='22' y='18' width='3' height='7' fill='%233D3A36'/%3E%3C/svg%3E" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Serif+SC:wght@600;700&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 3: 创建入口与路由**

`src/main.jsx`：

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
```

`src/App.jsx`：

```jsx
import { Routes, Route, Link } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import LessonsPage from './pages/LessonsPage.jsx'
import LessonPage from './pages/LessonPage.jsx'
import GuidePage from './pages/GuidePage.jsx'

function NotFound() {
  return (
    <main className="page">
      <h1>页面不存在</h1>
      <Link className="btn" to="/">返回首页</Link>
    </main>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/lessons" element={<LessonsPage />} />
      <Route path="/lessons/:id" element={<LessonPage />} />
      <Route path="/guide" element={<GuidePage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
```

四个页面组件先返回占位内容（后续 Task 替换）：

```jsx
// 例：src/pages/HomePage.jsx
export default function HomePage() {
  return <main className="page"><h1>首页</h1></main>
}
```

- [ ] **Step 4: 创建设计令牌与全局样式**

`src/styles/tokens.css`：

```css
:root {
  --bg: #FAF6EF;
  --surface: #FFFFFF;
  --surface-warm: #F3EAE0;
  --ink: #3D3A36;
  --ink-muted: #8A8178;
  --wood: #8B6B52;
  --wood-dark: #6E5340;
  --moss: #6B7A5E;
  --amber: #D9A066;
  --line: rgba(107, 94, 82, .14);
  --radius-card: 12px;
  --radius-pill: 999px;
  --radius-inner: 8px;
  --font-head: 'Noto Serif SC', 'Songti SC', 'SimSun', serif;
  --font-body: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}
```

`src/styles/global.css`（引入 tokens、基础排版与通用组件类 `.page` `.btn` `.card`，行距 1.7，正文 15–16px，标题用 `--font-head`）：

```css
@import './tokens.css';

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.7;
}
h1, h2, h3 { font-family: var(--font-head); line-height: 1.35; }
a { color: var(--wood-dark); }
.page { max-width: 960px; margin: 0 auto; padding: 24px 20px 72px; }
.btn {
  display: inline-block; padding: 10px 20px; border-radius: var(--radius-pill);
  background: var(--wood); color: #fff; text-decoration: none; font-weight: 500;
  border: 0; cursor: pointer; font-size: 15px;
}
.btn:hover { background: var(--wood-dark); }
.card {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--radius-card); padding: 20px;
}
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
```

- [ ] **Step 5: 创建 .gitignore 并安装依赖**

`.gitignore`：

```text
node_modules/
dist/
*.log
```

运行 `npm install`（在 `piano-studio/` 下）。若网络受限导致失败，使用 `require_escalated` 重试。

- [ ] **Step 6: 验证构建**

运行 `npm run build`。预期：构建成功，`dist/` 生成。

- [ ] **Step 7: Commit**

```bash
git add piano-studio
git commit -m "feat: scaffold Piano Studio Vite React app with design tokens and routes"
```

---

### Task 2: lib/notes.js — 简谱解析与频率

**Files:**
- Create: `piano-studio/src/lib/notes.js`
- Test: `piano-studio/src/lib/notes.test.js`

**Interfaces:**
- Produces: `parseExercise(str) => ExerciseNote[]`，其中 `ExerciseNote = { midi: number|null, beats: number, chord: number[]|null, chordLabels: string[]|null, label: string }`（单音时 `chord=null`、`chordLabels=null` 且 `midi` 有效；休止 `midi=null`；和弦 `chord=midi[]`、`chordLabels` 为每个音对应显示文本，`midi=null`）；`midiToFreq(midi) => number`；`STEP_TO_SEMITONE = {1:0,2:2,3:4,4:5,5:7,6:9,7:11}`。

- [ ] **Step 1: 写失败测试**

`piano-studio/src/lib/notes.test.js`：

```js
import { describe, it, expect } from 'vitest'
import { parseExercise, midiToFreq } from './notes.js'

describe('parseExercise', () => {
  it('解析单音与默认时值', () => {
    expect(parseExercise('1 2 3')).toEqual([
      { midi: 60, beats: 1, chord: null, chordLabels: null, label: '1' },
      { midi: 62, beats: 1, chord: null, chordLabels: null, label: '2' },
      { midi: 64, beats: 1, chord: null, chordLabels: null, label: '3' },
    ])
  })

  it('忽略小节线与未知 token', () => {
    expect(parseExercise('1 | 2 ‖: 3 :‖')).toHaveLength(3)
  })

  it('解析高八度/低八度/延长/半拍/附点/休止', () => {
    const out = parseExercise("1' 7, 1- 2_ 3. 0")
    expect(out[0].midi).toBe(72)
    expect(out[1].midi).toBe(59)
    expect(out[2].beats).toBe(2)
    expect(out[3].beats).toBe(0.5)
    expect(out[4].beats).toBe(1.5)
    expect(out[5].midi).toBeNull()
  })

  it('解析和弦', () => {
    const out = parseExercise("[135]- [572']")
    expect(out[0]).toEqual({ midi: null, beats: 2, chord: [60, 64, 67], chordLabels: ['1', '3', '5'], label: '135' })
    expect(out[1].chord).toEqual([67, 71, 74])
    expect(out[1].chordLabels).toEqual(['5', '7', "2'"])
  })

  it('解析中音区常见旋律', () => {
    const out = parseExercise('1 1 5 5 6 6 5-')
    expect(out.map(n => n.midi)).toEqual([60, 60, 67, 67, 69, 69, 67])
    expect(out[6].beats).toBe(2)
  })
})

describe('midiToFreq', () => {
  it('A4=440Hz，C4≈261.63Hz', () => {
    expect(midiToFreq(69)).toBeCloseTo(440, 2)
    expect(midiToFreq(60)).toBeCloseTo(261.63, 1)
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

运行 `npx vitest run src/lib/notes.test.js`。预期：FAIL，模块不存在。

- [ ] **Step 3: 实现 notes.js**

```js
export const STEP_TO_SEMITONE = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11 }

export function midiToFreq(midi) {
  return 440 * 2 ** ((midi - 69) / 12)
}

function parseSingleToken(token) {
  // 和弦：[135]、[572']、[61'3'] 等
  if (token.startsWith('[') && token.endsWith(']')) {
    const inner = token.slice(1, -1)
    const m = inner.match(/^([0-7',]+)([-_.]*)$/)
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
      while (i < m[1].length && (m[1][i] === "'" || m[1][i] === ',')) {
        oct += m[1][i] === "'" ? 1 : -1
        i += 1
      }
      midis.push(60 + STEP_TO_SEMITONE[step] + oct * 12)
      chordLabels.push(step + "'".repeat(oct) + ','.repeat(-oct))
    }
    const beats = beatsFromSuffix(m[2])
    return { midi: null, beats, chord: midis, chordLabels, label: chordLabels.join('') }
  }

  const m = token.match(/^([0-7])([' ,]*)([-_.]*)$/)
  if (!m) return null
  const step = Number(m[1])
  let oct = 0
  for (const c of m[2]) oct += c === "'" ? 1 : c === ',' ? -1 : 0
  if (step === 0) {
    return { midi: null, beats: beatsFromSuffix(m[3]), chord: null, chordLabels: null, label: '0' }
  }
  const midi = 60 + STEP_TO_SEMITONE[step] + oct * 12
  return { midi, beats: beatsFromSuffix(m[3]), chord: null, chordLabels: null, label: m[1] + m[2] }
}

function beatsFromSuffix(suffix) {
  let beats = 1
  for (const c of suffix) {
    if (c === '-') beats += 1
    if (c === '_') beats /= 2
    if (c === '.') beats += 0.5
  }
  return beats
}

export function parseExercise(str) {
  return str
    .split(/\s+/)
    .map(parseSingleToken)
    .filter(Boolean)
}
```

- [ ] **Step 4: 运行测试确认通过**

运行 `npx vitest run src/lib/notes.test.js`。预期：PASS。

- [ ] **Step 5: Commit**

```bash
git add piano-studio/src/lib/notes.js piano-studio/src/lib/notes.test.js
git commit -m "feat: add numbered-notation parser and MIDI frequency math"
```

---

### Task 3: lib/progress.js — 本地进度

**Files:**
- Create: `piano-studio/src/lib/progress.js`
- Test: `piano-studio/src/lib/progress.test.js`

**Interfaces:**
- Produces: `STORAGE_KEY = 'piano-studio.progress.v1'`；`loadProgress(storage?) => Progress`；`saveProgress(progress, storage?)`；`markLessonCompleted(progress, lessonId, stars) => Progress`；`nextLesson(lessonIds, progress) => lessonId|null`。`Progress = { completed: Record<string, { stars: number, doneAt: string }>, lastLessonId: string|null }`。`storage` 参数默认为 `globalThis.localStorage`，可注入假 storage 测试。

- [ ] **Step 1: 写失败测试**

`piano-studio/src/lib/progress.test.js`：

```js
import { describe, it, expect } from 'vitest'
import { loadProgress, saveProgress, markLessonCompleted, nextLesson } from './progress.js'

function fakeStorage(initial = {}) {
  const data = new Map(Object.entries(initial))
  return {
    getItem: (k) => (data.has(k) ? data.get(k) : null),
    setItem: (k, v) => data.set(k, String(v)),
    removeItem: (k) => data.delete(k),
  }
}

describe('progress', () => {
  it('无数据时返回空进度', () => {
    expect(loadProgress(fakeStorage())).toEqual({ completed: {}, lastLessonId: null })
  })

  it('localStorage 不可用时降级为内存', () => {
    const broken = { getItem() { throw new Error('denied') }, setItem() { throw new Error('denied') } }
    const p = loadProgress(broken)
    p.lastLessonId = 'lesson-01'
    expect(p.lastLessonId).toBe('lesson-01')
  })

  it('保存与读取往返一致', () => {
    const s = fakeStorage()
    const p = { completed: { 'lesson-01': { stars: 3, doneAt: '2026-08-18' } }, lastLessonId: 'lesson-01' }
    saveProgress(p, s)
    expect(loadProgress(s)).toEqual(p)
  })

  it('标记完成并保留历史', () => {
    let p = loadProgress(fakeStorage())
    p = markLessonCompleted(p, 'lesson-01', 2)
    p = markLessonCompleted(p, 'lesson-02', 3)
    expect(Object.keys(p.completed)).toEqual(['lesson-01', 'lesson-02'])
    expect(p.completed['lesson-01'].stars).toBe(2)
  })

  it('nextLesson 返回第一门未完成课程', () => {
    let p = loadProgress(fakeStorage())
    p = markLessonCompleted(p, 'lesson-01', 3)
    expect(nextLesson(['lesson-01', 'lesson-02', 'lesson-03'], p)).toBe('lesson-02')
    expect(nextLesson([], p)).toBeNull()
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

运行 `npx vitest run src/lib/progress.test.js`。预期：FAIL。

- [ ] **Step 3: 实现 progress.js**

```js
export const STORAGE_KEY = 'piano-studio.progress.v1'

const EMPTY = () => ({ completed: {}, lastLessonId: null })

function safeStorage(storage) {
  try {
    const probe = storage.getItem(STORAGE_KEY)
    return storage
  } catch {
    const mem = new Map()
    return {
      getItem: (k) => (mem.has(k) ? mem.get(k) : null),
      setItem: (k, v) => mem.set(k, String(v)),
    }
  }
}

export function loadProgress(storage = globalThis.localStorage) {
  const s = safeStorage(storage)
  try {
    const raw = s.getItem(STORAGE_KEY)
    if (!raw) return EMPTY()
    const parsed = JSON.parse(raw)
    return { completed: parsed.completed ?? {}, lastLessonId: parsed.lastLessonId ?? null }
  } catch {
    return EMPTY()
  }
}

export function saveProgress(progress, storage = globalThis.localStorage) {
  const s = safeStorage(storage)
  s.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function markLessonCompleted(progress, lessonId, stars) {
  const next = {
    ...progress,
    completed: {
      ...progress.completed,
      [lessonId]: { stars, doneAt: new Date().toISOString().slice(0, 10) },
    },
    lastLessonId: lessonId,
  }
  return next
}

export function nextLesson(lessonIds, progress) {
  return lessonIds.find((id) => !progress.completed[id]) ?? null
}
```

- [ ] **Step 4: 运行测试确认通过**

运行 `npx vitest run src/lib/progress.test.js`。预期：PASS。

- [ ] **Step 5: Commit**

```bash
git add piano-studio/src/lib/progress.js piano-studio/src/lib/progress.test.js
git commit -m "feat: add localStorage progress store with memory fallback"
```

---

### Task 4: lib/practice.js 状态机 + lib/audio.js 钢琴音色

**Files:**
- Create: `piano-studio/src/lib/practice.js`
- Test: `piano-studio/src/lib/practice.test.js`
- Create: `piano-studio/src/lib/audio.js`

**Interfaces:**
- Produces:
  - `createInitialPractice(notes) => PracticeState`，`PracticeState = { notes, index, mistakes, status: 'ready'|'done'|'wrong', target }`（`target` 为当前目标的 `chord` 或单音 `midi`，练习结束为 `null`）。
  - `practiceReducer(state, action) => PracticeState`，action：`{ type: 'input', midi }`、`{ type: 'wrong-clear' }`、`{ type: 'reset' }`、`{ type: 'demo-advance' }`。
  - `starsFor(mistakes) => 1|2|3`：0 次错=3，1–3 次=2，否则=1。
  - `createPianoSynth() => { play(midi), playChord(midis), ensureContext() }`（audio.js，浏览器端合成钢琴音色）。

- [ ] **Step 1: 写失败测试**

`piano-studio/src/lib/practice.test.js`：

```js
import { describe, it, expect } from 'vitest'
import { createInitialPractice, practiceReducer, starsFor } from './practice.js'
import { parseExercise } from './notes.js'

describe('practiceReducer', () => {
  const notes = parseExercise('1 2 3')

  it('输入正确前进', () => {
    let s = createInitialPractice(notes)
    s = practiceReducer(s, { type: 'input', midi: 60 })
    expect(s.index).toBe(1)
    expect(s.status).toBe('ready')
  })

  it('输入错误计数并提示', () => {
    let s = createInitialPractice(notes)
    s = practiceReducer(s, { type: 'input', midi: 62 })
    expect(s.index).toBe(0)
    expect(s.mistakes).toBe(1)
    expect(s.status).toBe('wrong')
    s = practiceReducer(s, { type: 'wrong-clear' })
    expect(s.status).toBe('ready')
  })

  it('最后一个音正确后完成', () => {
    let s = createInitialPractice(notes)
    for (const midi of [60, 62, 64]) s = practiceReducer(s, { type: 'input', midi })
    expect(s.status).toBe('done')
    expect(s.target).toBeNull()
  })

  it('和弦需按齐所有音才前进', () => {
    const chordNotes = parseExercise('[135]')
    let s = createInitialPractice(chordNotes)
    s = practiceReducer(s, { type: 'input', midi: 60 })
    expect(s.index).toBe(0)
    s = practiceReducer(s, { type: 'input', midi: 64 })
    expect(s.index).toBe(0)
    s = practiceReducer(s, { type: 'input', midi: 67 })
    expect(s.index).toBe(1)
  })

  it('休止符自动跳过，无需按键', () => {
    const restNotes = parseExercise('0 0 1 2')
    let s = createInitialPractice(restNotes)
    expect(s.index).toBe(2)
    s = practiceReducer(s, { type: 'input', midi: 60 })
    expect(s.index).toBe(3)
  })

  it('demo-advance 依次推进', () => {
    let s = createInitialPractice(notes)
    s = practiceReducer(s, { type: 'demo-advance' })
    expect(s.index).toBe(1)
    s = practiceReducer(s, { type: 'demo-advance' })
    s = practiceReducer(s, { type: 'demo-advance' })
    expect(s.status).toBe('done')
  })

  it('reset 回到起点', () => {
    let s = createInitialPractice(notes)
    s = practiceReducer(s, { type: 'input', midi: 60 })
    s = practiceReducer(s, { type: 'reset' })
    expect(s.index).toBe(0)
    expect(s.mistakes).toBe(0)
    expect(s.status).toBe('ready')
  })
})

describe('starsFor', () => {
  it('按错误次数给星', () => {
    expect(starsFor(0)).toBe(3)
    expect(starsFor(2)).toBe(2)
    expect(starsFor(4)).toBe(1)
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

运行 `npx vitest run src/lib/practice.test.js`。预期：FAIL。

- [ ] **Step 3: 实现 practice.js**

```js
function skipRests(notes, from) {
  let i = from
  while (i < notes.length && notes[i].midi === null && !notes[i].chord) i += 1
  return i
}

export function createInitialPractice(notes) {
  const index = skipRests(notes, 0)
  const first = notes[index] ?? null
  return {
    notes,
    index,
    mistakes: 0,
    status: 'ready',
    target: first ? (first.chord ?? first.midi) : null,
  }
}

function advance(state) {
  const nextIndex = skipRests(state.notes, state.index + 1)
  if (nextIndex >= state.notes.length) {
    return { ...state, index: nextIndex, status: 'done', target: null }
  }
  const next = state.notes[nextIndex]
  return { ...state, index: nextIndex, status: 'ready', target: next.chord ?? next.midi }
}

export function practiceReducer(state, action) {
  switch (action.type) {
    case 'input': {
      if (state.status === 'done') return state
      const note = state.notes[state.index]
      if (note.midi === null && !note.chord) return advance(state)
      if (note.chord) {
        const targetSet = new Set(note.chord)
        const next = new Set(state.pressed ?? [])
        if (targetSet.has(action.midi)) next.add(action.midi)
        if (next.size >= targetSet.size) return advance({ ...state, pressed: undefined })
        return { ...state, pressed: [...next] }
      }
      if (note.midi === action.midi) return advance(state)
      return { ...state, mistakes: state.mistakes + 1, status: 'wrong' }
    }
    case 'wrong-clear':
      return state.status === 'wrong' ? { ...state, status: 'ready' } : state
    case 'demo-advance':
      return state.status === 'done' ? state : advance(state)
    case 'reset':
      return createInitialPractice(state.notes)
    default:
      return state
  }
}

export function starsFor(mistakes) {
  if (mistakes === 0) return 3
  if (mistakes <= 3) return 2
  return 1
}
```

- [ ] **Step 4: 运行测试确认通过**

运行 `npx vitest run src/lib/practice.test.js`。预期：PASS。

- [ ] **Step 5: 实现 audio.js（钢琴音色合成）**

```js
import { midiToFreq } from './notes.js'

export function createPianoSynth() {
  let ctx = null

  function ensureContext() {
    if (!ctx) {
      const AC = globalThis.AudioContext || globalThis.webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    if (ctx.state === 'suspended') ctx.resume()
    return ctx
  }

  function playNote(midi, when = 0) {
    const c = ensureContext()
    if (!c) return
    const t = c.currentTime + when
    const freq = midiToFreq(midi)
    const master = c.createGain()
    master.gain.setValueAtTime(0.0001, t)
    master.gain.exponentialRampToValueAtTime(0.22, t + 0.012)
    master.gain.exponentialRampToValueAtTime(0.0001, t + 1.6)
    master.connect(c.destination)
    const partials = [
      { ratio: 1, gain: 1 },
      { ratio: 2, gain: 0.35 },
      { ratio: 3, gain: 0.12 },
    ]
    for (const p of partials) {
      const osc = c.createOscillator()
      const g = c.createGain()
      osc.type = 'triangle'
      osc.frequency.value = freq * p.ratio
      g.gain.value = p.gain
      osc.connect(g)
      g.connect(master)
      osc.start(t)
      osc.stop(t + 1.7)
    }
  }

  function playChord(midis, when = 0) {
    midis.forEach((m) => playNote(m, when))
  }

  return { play: playNote, playChord, ensureContext }
}
```

- [ ] **Step 6: 验证 audio.js 语法**

运行 `node --check piano-studio/src/lib/audio.js`。预期：无输出、退出码 0。

- [ ] **Step 7: Commit**

```bash
git add piano-studio/src/lib/practice.js piano-studio/src/lib/practice.test.js piano-studio/src/lib/audio.js
git commit -m "feat: add guided-practice state machine and Web Audio piano synth"
```

---

### Task 5: 课程与练习数据（24 课）

**Files:**
- Create: `piano-studio/src/data/stages.js`
- Create: `piano-studio/src/data/lessons.js`
- Create: `piano-studio/src/data/exercises.js`
- Test: `piano-studio/src/data/data.test.js`

**Interfaces:**
- Produces:
  - `stages = [{ id: 1, title: '认识与入门', range: '1–8 课', summary, accent }]`（3 项，accent 取 `--wood` / `--moss` / `--amber` 之一）。
  - `lessons = [{ id, stage, order, title, goal, intro: [{ type: 'p'|'tip'|'demo', text?, demoKind? }], exerciseIds: string[] }]`，共 24 项。
  - `exercises = { [exerciseId]: { id, title, notes: string } }`。
  - `getExerciseNotes(id) => ExerciseNote[]`（内部 `parseExercise` 缓存）。

- [ ] **Step 1: 写失败测试**

`piano-studio/src/data/data.test.js`：

```js
import { describe, it, expect } from 'vitest'
import { lessons, stages } from './lessons.js'
import { exercises, getExerciseNotes } from './exercises.js'

describe('课程数据', () => {
  it('共 24 课且 id 唯一', () => {
    expect(lessons).toHaveLength(24)
    expect(new Set(lessons.map((l) => l.id)).size).toBe(24)
  })

  it('每个阶段 8 课且顺序连续', () => {
    for (const s of stages) {
      const inStage = lessons.filter((l) => l.stage === s.id)
      expect(inStage).toHaveLength(8)
    }
    expect(lessons.map((l) => l.order)).toEqual([...Array(24).keys()].map((i) => i + 1))
  })

  it('每课至少 1 个练习，练习 id 存在', () => {
    for (const l of lessons) {
      expect(l.exerciseIds.length).toBeGreaterThanOrEqual(1)
      for (const eid of l.exerciseIds) {
        expect(exercises[eid]).toBeDefined()
      }
    }
  })

  it('所有练习可被解析且音高落在 C3–E5', () => {
    for (const ex of Object.values(exercises)) {
      const notes = getExerciseNotes(ex.id)
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
})
```

- [ ] **Step 2: 运行测试确认失败**

运行 `npx vitest run src/data/data.test.js`。预期：FAIL。

- [ ] **Step 3: 创建 stages.js 与课程内容**

`stages.js`：

```js
export const stages = [
  { id: 1, title: '认识与入门', range: '1–8 课', summary: '认识键盘、手型与简谱，弹出第一首小曲。', accent: 'var(--wood)' },
  { id: 2, title: '基础与双手', range: '9–16 课', summary: '音阶、双手协调与三首经典旋律。', accent: 'var(--moss)' },
  { id: 3, title: '和弦与伴奏', range: '17–24 课', summary: '四个常用和弦与两种伴奏型，能弹简单流行歌。', accent: 'var(--amber)' },
]
```

`lessons.js` 中 `intro` 字段的块类型约定：
- `{ type: 'p', text }` 段落；
- `{ type: 'tip', text }` 提示条；
- `{ type: 'demo', demoKind: 'posture' }` 手型 SVG 动画；
- `{ type: 'demo', demoKind: 'highlight', notes }` 键盘高亮演示。

完整课程数据如下（`intro` 即最终文案，直接写入 `lessons.js`）：

```js
export const lessons = [
  {
    id: 'lesson-01', stage: 1, order: 1,
    title: '认识钢琴与键盘',
    goal: '能在琴键上找到 do re mi fa sol la si 的位置',
    intro: [
      { type: 'p', text: '钢琴有 88 个琴键，白键和黑键按固定规律排列：两个黑键一组、三个黑键一组，交替出现。' },
      { type: 'demo', demoKind: 'highlight', notes: '1 2 3 4 5 6 7 1\'' },
      { type: 'p', text: '找到任意“两个黑键”左边紧挨着的白键，那就是 do（C）。从 do 往右数：do re mi fa sol la si，再往右又是高一个八度的 do。' },
      { type: 'tip', text: '先只用右手 1 指（拇指）慢慢按，把每个音的位置记住。' },
    ],
    exerciseIds: ['lesson-01-ex1', 'lesson-01-ex2'],
  },
  {
    id: 'lesson-02', stage: 1, order: 2,
    title: '坐姿与手型',
    goal: '摆出放松而稳定的坐姿与手型',
    intro: [
      { type: 'p', text: '坐在琴凳前三分之一处，双脚平放地面，背部挺直但不僵硬。' },
      { type: 'demo', demoKind: 'posture' },
      { type: 'p', text: '手像轻轻握住一个鸡蛋：指尖立起，手腕与手背齐平，肩膀放松。' },
      { type: 'tip', text: '每练几分钟就放下手休息一下，手酸说明太紧张了。' },
    ],
    exerciseIds: ['lesson-02-ex1'],
  },
  {
    id: 'lesson-03', stage: 1, order: 3,
    title: '手指编号与单手练习',
    goal: '熟悉 1–5 指编号并能灵活运指',
    intro: [
      { type: 'p', text: '双手手指编号：拇指是 1 指，食指 2 指，中指 3 指，无名指 4 指，小指 5 指。' },
      { type: 'demo', demoKind: 'highlight', notes: '1 2 3 4 5 4 3 2' },
      { type: 'p', text: '右手 1 指放在 do 上，依次用 1 2 3 4 5 指弹 do re mi fa sol，再倒回来。' },
    ],
    exerciseIds: ['lesson-03-ex1'],
  },
  {
    id: 'lesson-04', stage: 1, order: 4,
    title: '简谱入门：音名、唱名与数字谱',
    goal: '看懂 1–7 与 do re mi 的对应关系',
    intro: [
      { type: 'p', text: '简谱用数字 1 2 3 4 5 6 7 表示 do re mi fa sol la si，数字越大音越高。' },
      { type: 'p', text: '数字上方加点是高八度（本站用 1\' 表示），下方加点是低八度（本站用 1, 表示）。' },
      { type: 'tip', text: '把 “1=do、2=re、3=mi……” 念顺口，练琴前先在心里默念一遍。' },
    ],
    exerciseIds: ['lesson-04-ex1'],
  },
  {
    id: 'lesson-05', stage: 1, order: 5,
    title: '时值基础：全音符、二分、四分与八分',
    goal: '区分不同音符的长短',
    intro: [
      { type: 'p', text: '音符的长短叫时值。数字后面加“-”延长一拍：1- 是两拍，1--- 是四拍。' },
      { type: 'p', text: '数字下面加横线是半拍（本站用 1_ 表示）；不加任何符号默认一拍。' },
      { type: 'tip', text: '长音要“稳住”，短音要“轻巧”，先数拍子再下手。' },
    ],
    exerciseIds: ['lesson-05-ex1'],
  },
  {
    id: 'lesson-06', stage: 1, order: 6,
    title: '小节与拍号',
    goal: '会看小节线、拍号并按 4/4 拍数拍',
    intro: [
      { type: 'p', text: '竖线把乐谱分成一节一节的小节；4/4 表示每小节四拍，以四分音符为一拍。' },
      { type: 'demo', demoKind: 'highlight', notes: '1 2 3 4 | 5 5 5 5 | 4 3 2 1 | 1- - -' },
      { type: 'tip', text: '练琴时心里数 “1 2 3 4”，每一拍都踩在点上。' },
    ],
    exerciseIds: ['lesson-06-ex1'],
  },
  {
    id: 'lesson-07', stage: 1, order: 7,
    title: '节奏练习：稳定打拍',
    goal: '能跟着稳定拍点弹奏，不忽快忽慢',
    intro: [
      { type: 'p', text: '节奏不稳是初学者最常见的问题。先用脚或节拍器固定速度，再让手指跟上。' },
      { type: 'p', text: '半拍与一拍的组合最容易乱，先放慢速度，稳稳数拍。' },
    ],
    exerciseIds: ['lesson-07-ex1'],
  },
  {
    id: 'lesson-08', stage: 1, order: 8,
    title: '曲目练习：《小星星》前半段',
    goal: '完整、稳定地弹奏《小星星》第一段',
    intro: [
      { type: 'p', text: '今天把学到的全部用上：认音、数拍、保持手型。' },
      { type: 'demo', demoKind: 'highlight', notes: '1 1 5 5 6 6 5- | 4 4 3 3 2 2 1-' },
      { type: 'tip', text: '先听演示把旋律记在心里，再一个音一个音地跟练。' },
    ],
    exerciseIds: ['lesson-08-ex1'],
  },
  {
    id: 'lesson-09', stage: 2, order: 9,
    title: 'C 大调音阶',
    goal: '上下行流畅弹奏 C 大调音阶',
    intro: [
      { type: 'p', text: '从 do 到高音 do 依次弹 1 2 3 4 5 6 7 1\'，这就是 C 大调音阶。' },
      { type: 'demo', demoKind: 'highlight', notes: '1 2 3 4 5 6 7 1\' | 1\' 7 6 5 4 3 2 1' },
      { type: 'tip', text: '右手上行时，1 指要从 3 指下方“钻”过去，动作要小、要平滑。' },
    ],
    exerciseIds: ['lesson-09-ex1'],
  },
  {
    id: 'lesson-10', stage: 2, order: 10,
    title: '双手交替与协调',
    goal: '左右手能交替弹奏而不打架',
    intro: [
      { type: 'p', text: '钢琴是左右手的分工游戏。左手负责低音，右手负责高音，像两个人对话。' },
      { type: 'demo', demoKind: 'highlight', notes: '1 1, 2 2, 3 3, 4 4, | 5 5, 6 6, 7 7, 1\' 1\'' },
      { type: 'tip', text: '哪只手弹，就只用哪只手，另一只手轻轻放在腿上。' },
    ],
    exerciseIds: ['lesson-10-ex1'],
  },
  {
    id: 'lesson-11', stage: 2, order: 11,
    title: '曲目练习：《小星星》完整版',
    goal: '完整弹奏《小星星》，注意段落反复',
    intro: [
      { type: 'p', text: '完整版包含第二段“一闪一闪”的重复与结尾，把前后两段连起来。' },
      { type: 'demo', demoKind: 'highlight', notes: '1 1 5 5 6 6 5- | 4 4 3 3 2 2 1- | 5 5 4 4 3 3 2- | 5 5 4 4 3 3 2- | 1 1 5 5 6 6 5- | 4 4 3 3 2 2 1- | 5 5 4 4 3 3 2- | 1- - -' },
    ],
    exerciseIds: ['lesson-11-ex1'],
  },
  {
    id: 'lesson-12', stage: 2, order: 12,
    title: '曲目练习：《两只老虎》',
    goal: '弹奏《两只老虎》，练习同音反复',
    intro: [
      { type: 'p', text: '这首曲子里有大量“同音反复”，练的是手指快速、均匀地弹同一个音。' },
      { type: 'demo', demoKind: 'highlight', notes: '1 2 3 1 | 1 2 3 1 | 3 4 5- | 3 4 5- | 5 6 5 4 3 1 | 5 6 5 4 3 1 | 1 5 1- | 1 5 1-' },
    ],
    exerciseIds: ['lesson-12-ex1'],
  },
  {
    id: 'lesson-13', stage: 2, order: 13,
    title: '曲目练习：《欢乐颂》',
    goal: '弹奏《欢乐颂》，体会旋律的呼吸感',
    intro: [
      { type: 'p', text: '《欢乐颂》旋律大气，乐句之间有自然的呼吸停顿，弹完一句轻轻抬手。' },
      { type: 'demo', demoKind: 'highlight', notes: '3 3 4 5 | 5 4 3 2 | 1 1 2 3 | 3- 2- | 3 3 4 5 | 5 4 3 2 | 1 1 2 3 | 2- 1-' },
    ],
    exerciseIds: ['lesson-13-ex1'],
  },
  {
    id: 'lesson-14', stage: 2, order: 14,
    title: '附点音符与休止符',
    goal: '认识附点音符和休止符并正确演奏',
    intro: [
      { type: 'p', text: '数字右边加“.”，时值延长一半：1. 表示一拍半（本站用 1. 表示）。' },
      { type: 'p', text: '0 是休止符：不发声，但占满一拍，拍子不能停。' },
      { type: 'tip', text: '休止符最容易抢拍，数到 0 的那一拍时保持安静。' },
    ],
    exerciseIds: ['lesson-14-ex1'],
  },
  {
    id: 'lesson-15', stage: 2, order: 15,
    title: '反复记号与常见记谱符号',
    goal: '认识反复记号，不再被乐谱绕晕',
    intro: [
      { type: 'p', text: '歌曲常有大段重复，用 ‖：和 ：‖ 括起来的部分要再弹一遍；D.C. 表示从头反复。' },
      { type: 'demo', demoKind: 'highlight', notes: '1 2 3 1 | 1 2 3 1 | 3 4 5- | 3 4 5- ‖: 5 6 5 4 3 1 | 5 6 5 4 3 1 | 1 5 1- | 1 5 1- :‖' },
      { type: 'tip', text: '先弹一遍完整的旋律，再听演示感受反复怎么接。' },
    ],
    exerciseIds: ['lesson-15-ex1'],
  },
  {
    id: 'lesson-16', stage: 2, order: 16,
    title: '综合复习小曲：《小蜜蜂》',
    goal: '独立弹奏一首新的小曲',
    intro: [
      { type: 'p', text: '挑战一首没练过的小曲：把节奏、认音、双手换位全部用上。' },
      { type: 'demo', demoKind: 'highlight', notes: '3 3 3 5 | 5 4 3 2 | 1 1 2 3 | 3 2 1- | 5 5 5 3 | 3 2 1 7, | 1 1 2 3 | 3 2 1-' },
    ],
    exerciseIds: ['lesson-16-ex1'],
  },
  {
    id: 'lesson-17', stage: 3, order: 17,
    title: '三和弦入门：C、G、Am、F',
    goal: '认识并弹出流行歌最常用的四个和弦',
    intro: [
      { type: 'p', text: '三个音按三度叠在一起就是三和弦。C=1 3 5，G=5 7 2\'，Am=6 1\' 3\'，F=4 6 1\'。' },
      { type: 'demo', demoKind: 'highlight', notes: '[135]- [572\']- [61\'3\']- [461\']-' },
      { type: 'tip', text: '和弦要三个音一起按下去，先慢，确认三个手指同时发声。' },
    ],
    exerciseIds: ['lesson-17-ex1'],
  },
  {
    id: 'lesson-18', stage: 3, order: 18,
    title: '柱式和弦伴奏型',
    goal: '用柱式和弦连接 C→G→Am→F',
    intro: [
      { type: 'p', text: '柱式和弦是三个音同时按下、像柱子一样立住，是伴奏最基础的型。' },
      { type: 'demo', demoKind: 'highlight', notes: '[135]- [572\']- [61\'3\']- [461\']-' },
      { type: 'tip', text: '四个和弦之间的手位变化要小，尽量让手指“滑”过去。' },
    ],
    exerciseIds: ['lesson-18-ex1'],
  },
  {
    id: 'lesson-19', stage: 3, order: 19,
    title: '分解和弦伴奏型',
    goal: '弹会“1–3–5–3”分解型',
    intro: [
      { type: 'p', text: '把和弦拆开依次弹就叫分解和弦。最常用的型是 1 3 5 3（根音—三音—五音—三音）。' },
      { type: 'demo', demoKind: 'highlight', notes: '1 3 5 3 | 5 7 2\' 7 | 6 1\' 3\' 1\' | 4 6 1\' 6' },
    ],
    exerciseIds: ['lesson-19-ex1'],
  },
  {
    id: 'lesson-20', stage: 3, order: 20,
    title: '左右手配合：根音 + 和弦',
    goal: '左手根音、右手和弦交替弹奏',
    intro: [
      { type: 'p', text: '左手弹和弦的根音（1, / 5, / 6 / 4），右手弹和弦音。根音是“地基”，和弦是“房子”。' },
      { type: 'demo', demoKind: 'highlight', notes: '1, [135] | 5, [572\'] | 6 [61\'3\'] | 4 [461\']' },
      { type: 'tip', text: '先只练左手根音连接，再加右手和弦，最后合在一起。' },
    ],
    exerciseIds: ['lesson-20-ex1'],
  },
  {
    id: 'lesson-21', stage: 3, order: 21,
    title: '伴奏节奏型变化',
    goal: '弹会“根音 + 分解和弦”的律动型',
    intro: [
      { type: 'p', text: '把柱式和弦改成“根音 + 分解和弦”，伴奏立刻有了律动感。' },
      { type: 'demo', demoKind: 'highlight', notes: '1, 3 5 3 | 5, 7 2\' 7 | 6 1\' 3\' 1\' | 4 6 1\' 6' },
    ],
    exerciseIds: ['lesson-21-ex1'],
  },
  {
    id: 'lesson-22', stage: 3, order: 22,
    title: '弹唱入门：旋律 + 和弦',
    goal: '用《欢乐颂》练习“和弦 + 旋律”自弹',
    intro: [
      { type: 'p', text: '右手旋律、左手和弦的“自弹”是最实用的技能。每小节先弹和弦，再接旋律。' },
      { type: 'demo', demoKind: 'highlight', notes: '[135] 3 3 4 5 | [461\'] 5 4 3 2 | [135] 1 1 2 3 | [572\'] 3 2 2' },
      { type: 'tip', text: '和弦占第一拍，后面的旋律音要稳稳落在拍点上。' },
    ],
    exerciseIds: ['lesson-22-ex1'],
  },
  {
    id: 'lesson-23', stage: 3, order: 23,
    title: '结业曲目：《月亮代表我的心》',
    goal: '完整弹奏简化改编版旋律',
    intro: [
      { type: 'p', text: '把学过的都串起来。这是为入门者简化改编的旋律版，先练右手旋律。' },
      { type: 'demo', demoKind: 'highlight', notes: '5 1 3 2 1 | 5 6 5 3 2 | 1 3 2 1 6 | 5 3 5 2- | 5 1 3 2 1 | 5 6 5 3 2 | 1 3 2 1 2 | 1- - -' },
      { type: 'tip', text: '整首曲子速度要稳，先慢速跟练三遍，再一点点提速。' },
    ],
    exerciseIds: ['lesson-23-ex1'],
  },
  {
    id: 'lesson-24', stage: 3, order: 24,
    title: '综合复习与进阶路线',
    goal: '完整弹奏《欢乐颂》伴奏版并规划下一步',
    intro: [
      { type: 'p', text: '复习 C G Am F 与两种伴奏型，完整弹一遍带和弦的《欢乐颂》。' },
      { type: 'demo', demoKind: 'highlight', notes: '[135] 3 3 4 5 | [461\'] 5 4 3 2 | [135] 1 1 2 3 | [572\'] 3 2 2 | [135] 3 3 4 5 | [461\'] 5 4 3 2 | [135] 1 1 2 3 | [572\'] 2 1 1' },
      { type: 'p', text: '之后可以学 Dm、Em 等新和弦，练习踏板，或直接找喜欢的歌练弹唱。' },
    ],
    exerciseIds: ['lesson-24-ex1'],
  },
]
```

- [ ] **Step 4: 创建 exercises.js**

```js
import { parseExercise } from '../lib/notes.js'

const cache = new Map()

export const exercises = {
  'lesson-01-ex1': { id: 'lesson-01-ex1', title: '找到 do 的位置', notes: '1 2 3 4 5 4 3 2' },
  'lesson-01-ex2': { id: 'lesson-01-ex2', title: '七音上行再下行', notes: '1 2 3 4 5 6 7 1\'' },
  'lesson-02-ex1': { id: 'lesson-02-ex1', title: '五指轻触琴键', notes: '1 2 3 4 5 | 5 4 3 2 1' },
  'lesson-03-ex1': { id: 'lesson-03-ex1', title: '手指爬梯', notes: '1 2 3 4 5 4 3 2 | 1 2 3 4 5 4 3 2' },
  'lesson-04-ex1': { id: 'lesson-04-ex1', title: '七音音阶', notes: '1 2 3 4 5 6 7 1\' | 1\' 7 6 5 4 3 2 1' },
  'lesson-05-ex1': { id: 'lesson-05-ex1', title: '长短音对比', notes: '1- 2- 3- 4- | 5 5 5 5 | 1_ 1_ 2_ 2_ 3-' },
  'lesson-06-ex1': { id: 'lesson-06-ex1', title: '四拍小节', notes: '1 2 3 4 | 5 5 5 5 | 4 3 2 1 | 1- - -' },
  'lesson-07-ex1': { id: 'lesson-07-ex1', title: '半拍与整拍', notes: '1_ 1_ 2_ 2_ | 3 3 4- | 5_ 5_ 6_ 6_ | 7 1\' - -' },
  'lesson-08-ex1': { id: 'lesson-08-ex1', title: '小星星（前半）', notes: '1 1 5 5 6 6 5- | 4 4 3 3 2 2 1- | 5 5 4 4 3 3 2- | 5 5 4 4 3 3 2-' },
  'lesson-09-ex1': { id: 'lesson-09-ex1', title: 'C 大调音阶', notes: '1 2 3 4 5 6 7 1\' | 1\' 7 6 5 4 3 2 1' },
  'lesson-10-ex1': { id: 'lesson-10-ex1', title: '左右对话', notes: '1 1, 2 2, 3 3, 4 4, | 5 5, 6 6, 7 7, 1\' 1\'' },
  'lesson-11-ex1': { id: 'lesson-11-ex1', title: '小星星（完整）', notes: '1 1 5 5 6 6 5- | 4 4 3 3 2 2 1- | 5 5 4 4 3 3 2- | 5 5 4 4 3 3 2- | 1 1 5 5 6 6 5- | 4 4 3 3 2 2 1- | 5 5 4 4 3 3 2- | 1- - -' },
  'lesson-12-ex1': { id: 'lesson-12-ex1', title: '两只老虎', notes: '1 2 3 1 | 1 2 3 1 | 3 4 5- | 3 4 5- | 5 6 5 4 3 1 | 5 6 5 4 3 1 | 1 5 1- | 1 5 1-' },
  'lesson-13-ex1': { id: 'lesson-13-ex1', title: '欢乐颂', notes: '3 3 4 5 | 5 4 3 2 | 1 1 2 3 | 3- 2- | 3 3 4 5 | 5 4 3 2 | 1 1 2 3 | 2- 1-' },
  'lesson-14-ex1': { id: 'lesson-14-ex1', title: '附点与休止', notes: '1. 1 5. 5 | 6. 6 5- | 0 0 4 4 | 3 3 2-' },
  'lesson-15-ex1': { id: 'lesson-15-ex1', title: '反复记号练习', notes: '1 2 3 1 | 1 2 3 1 | 3 4 5- | 3 4 5- ‖: 5 6 5 4 3 1 | 5 6 5 4 3 1 | 1 5 1- | 1 5 1- :‖' },
  'lesson-16-ex1': { id: 'lesson-16-ex1', title: '小蜜蜂', notes: '3 3 3 5 | 5 4 3 2 | 1 1 2 3 | 3 2 1- | 5 5 5 3 | 3 2 1 7, | 1 1 2 3 | 3 2 1-' },
  'lesson-17-ex1': { id: 'lesson-17-ex1', title: '四个和弦', notes: '[135]- [572\']- [61\'3\']- [461\']-' },
  'lesson-18-ex1': { id: 'lesson-18-ex1', title: '柱式和弦连接', notes: '[135]- [572\']- [61\'3\']- [461\']- ‖: [135]- [572\']- [61\'3\']- [461\']- :‖' },
  'lesson-19-ex1': { id: 'lesson-19-ex1', title: '分解和弦 1-3-5-3', notes: '1 3 5 3 | 5 7 2\' 7 | 6 1\' 3\' 1\' | 4 6 1\' 6' },
  'lesson-20-ex1': { id: 'lesson-20-ex1', title: '根音 + 和弦', notes: '1, [135] | 5, [572\'] | 6 [61\'3\'] | 4 [461\']' },
  'lesson-21-ex1': { id: 'lesson-21-ex1', title: '根音 + 分解', notes: '1, 3 5 3 | 5, 7 2\' 7 | 6 1\' 3\' 1\' | 4 6 1\' 6' },
  'lesson-22-ex1': { id: 'lesson-22-ex1', title: '欢乐颂（和弦 + 旋律）', notes: '[135] 3 3 4 5 | [461\'] 5 4 3 2 | [135] 1 1 2 3 | [572\'] 3 2 2' },
  'lesson-23-ex1': { id: 'lesson-23-ex1', title: '月亮代表我的心（简化改编）', notes: '5 1 3 2 1 | 5 6 5 3 2 | 1 3 2 1 6 | 5 3 5 2- | 5 1 3 2 1 | 5 6 5 3 2 | 1 3 2 1 2 | 1- - -' },
  'lesson-24-ex1': { id: 'lesson-24-ex1', title: '欢乐颂（完整伴奏）', notes: '[135] 3 3 4 5 | [461\'] 5 4 3 2 | [135] 1 1 2 3 | [572\'] 3 2 2 | [135] 3 3 4 5 | [461\'] 5 4 3 2 | [135] 1 1 2 3 | [572\'] 2 1 1' },
}

export function getExerciseNotes(id) {
  if (!cache.has(id)) {
    const ex = exercises[id]
    if (!ex) throw new Error(`Unknown exercise: ${id}`)
    cache.set(id, parseExercise(ex.notes))
  }
  return cache.get(id)
}
```

- [ ] **Step 5: 创建 lessons.js 的导出与校验辅助**

`lessons.js` 末尾导出：

```js
export function getLesson(id) {
  return lessons.find((l) => l.id === id) ?? null
}

export function lessonsByStage(stageId) {
  return lessons.filter((l) => l.stage === stageId)
}
```

- [ ] **Step 6: 运行测试确认通过**

运行 `npx vitest run src/data/data.test.js`。预期：PASS。

- [ ] **Step 7: Commit**

```bash
git add piano-studio/src/data
git commit -m "feat: add 24-lesson curriculum and guided-practice exercise data"
```

---

### Task 6: 键盘、简谱与序列播放组件

**Files:**
- Create: `piano-studio/src/components/Piano.jsx`
- Create: `piano-studio/src/components/SheetDisplay.jsx`
- Create: `piano-studio/src/components/SequencePlayer.jsx`
- Create: `piano-studio/src/lib/keys.js`
- Test: `piano-studio/src/lib/keys.test.js`

**Interfaces:**
- Produces:
  - `keys.js`: `KEY_TO_MIDI`（小写字母 → MIDI，覆盖 `a`–`k` 白键与 `w e t y u` 黑键）；`PianoRange = { low: 48, high: 76 }`；`midiToLabel(midi) => '1'|'2'|…`（C 大调七音的简谱编号，其它音返回 `#`/`b` 标记）。
  - `Piano` props：`{ highlight?: number[]|null, active?: number[]|null, range?: {low,high}, onPlay?(midi), disabled? }`；键盘内点击白/黑键调用 `onPlay(midi)`；高亮键使用 `--amber` 呼吸样式。
  - `SheetDisplay` props：`{ notes, currentIndex }`，渲染简谱音符序列，当前音符高亮、和弦堆叠显示。
  - `SequencePlayer` props：`{ notes, synth, tempo?, onNote?(note, index), onEnd?() }`，从 index 0 顺序播放（含和弦），播放时调用 `onNote`。

- [ ] **Step 1: 写失败测试**

`piano-studio/src/lib/keys.test.js`：

```js
import { describe, it, expect } from 'vitest'
import { KEY_TO_MIDI, midiToLabel } from './keys.js'

describe('keys', () => {
  it('字母键映射到中央 C 八度', () => {
    expect(KEY_TO_MIDI.a).toBe(60)
    expect(KEY_TO_MIDI.j).toBe(71)
    expect(KEY_TO_MIDI.k).toBe(72)
  })

  it('黑键映射', () => {
    expect(KEY_TO_MIDI.w).toBe(61)
    expect(KEY_TO_MIDI.u).toBe(70)
  })

  it('midiToLabel 输出简谱编号', () => {
    expect(midiToLabel(60)).toBe('1')
    expect(midiToLabel(72)).toBe("1'")
    expect(midiToLabel(48)).toBe('1,')
    expect(midiToLabel(61)).toBe('#1')
  })
})
```

- [ ] **Step 2: 运行测试确认失败**

运行 `npx vitest run src/lib/keys.test.js`。预期：FAIL。

- [ ] **Step 3: 实现 keys.js**

```js
import { STEP_TO_SEMITONE } from './notes.js'

export const KEY_TO_MIDI = {
  a: 60, w: 61, s: 62, e: 63, d: 64, f: 65, t: 66, g: 67,
  y: 68, h: 69, u: 70, j: 71, k: 72,
}

export const PIANO_RANGE = { low: 48, high: 76 }

const REVERSE = Object.fromEntries(Object.entries(STEP_TO_SEMITONE).map(([k, v]) => [v, k]))

export function midiToLabel(midi) {
  const semitone = ((midi - 60) % 12 + 12) % 12
  if (REVERSE[semitone] !== undefined) {
    const octaveDelta = Math.floor((midi - 60) / 12)
    return REVERSE[semitone] + (octaveDelta > 0 ? "'".repeat(octaveDelta) : ','.repeat(-octaveDelta))
  }
  return `#${REVERSE[((midi - 1 - 60) % 12 + 12) % 12] ?? ''}${midi}`
}
```

- [ ] **Step 4: 运行测试确认通过**

运行 `npx vitest run src/lib/keys.test.js`。预期：PASS。

- [ ] **Step 5: 实现 Piano 组件**

`Piano.jsx`（要点：根据 `PIANO_RANGE` 计算白键列表与黑键位置；黑键绝对定位在相邻白键交界处；`highlight`/`active` 为 MIDI 数组；键上显示 `midiToLabel`；整组件带 `.piano` 与 `.piano-key` class，供 CSS 使用）：

```jsx
import { PIANO_RANGE, midiToLabel } from '../lib/keys.js'

const WHITE_STEPS = [0, 2, 4, 5, 7, 9, 11]
const BLACK_AFTER = new Set([0, 1, 3, 4, 5])

export default function Piano({ highlight = [], active = [], range = PIANO_RANGE, onPlay, disabled = false }) {
  const whiteMidis = []
  for (let midi = range.low; midi <= range.high; midi++) {
    if (![1, 3, 6, 8, 10].includes(((midi - 60) % 12 + 12) % 12)) whiteMidis.push(midi)
  }
  const blackMidis = []
  for (let midi = range.low; midi <= range.high; midi++) {
    const s = ((midi - 60) % 12 + 12) % 12
    if ([1, 3, 6, 8, 10].includes(s)) blackMidis.push(midi)
  }
  const keyWidth = 100 / whiteMidis.length

  return (
    <div className="piano" role="group" aria-label="虚拟钢琴">
      {whiteMidis.map((midi) => {
        const activeCls = active.includes(midi) ? ' is-active' : ''
        const hlCls = highlight.includes(midi) ? ' is-highlight' : ''
        return (
          <button
            key={midi}
            type="button"
            className={`piano-key white${activeCls}${hlCls}`}
            style={{ width: `${keyWidth}%` }}
            onClick={() => !disabled && onPlay?.(midi)}
            aria-label={`琴键 ${midiToLabel(midi)}`}
          >
            <span className="piano-label">{midiToLabel(midi)}</span>
          </button>
        )
      })}
      {blackMidis.map((midi) => {
        const indexInWhites = whiteMidis.indexOf(midi - 1)
        const left = ((indexInWhites + 1) / whiteMidis.length) * 100
        const cls = active.includes(midi) ? ' is-active' : highlight.includes(midi) ? ' is-highlight' : ''
        return (
          <button
            key={midi}
            type="button"
            className={`piano-key black${cls}`}
            style={{ left: `${left}%` }}
            onClick={() => !disabled && onPlay?.(midi)}
            aria-label={`琴键 ${midiToLabel(midi)}`}
          />
        )
      })}
    </div>
  )
}
```

- [ ] **Step 6: 实现 SheetDisplay 组件**

`SheetDisplay.jsx`（把 `notes` 渲染为一行简谱，`currentIndex` 对应音符加 `.is-current`；和弦渲染为纵向堆叠的小数字）：

```jsx
export default function SheetDisplay({ notes, currentIndex = -1 }) {
  return (
    <div className="sheet" role="img" aria-label="简谱">
      {notes.map((note, i) => (
        <span key={i} className={`sheet-note${i === currentIndex ? ' is-current' : ''}`}>
          {note.chord
            ? <span className="sheet-chord">{note.chordLabels.map((label, j) => <span key={j} className="sheet-chord-note">{label}</span>)}</span>
            : <span className="sheet-pitch">{note.label}</span>}
          {note.beats > 1 && <span className="sheet-dash">{'-'.repeat(note.beats - 1)}</span>}
        </span>
      ))}
    </div>
  )
}
```

- [ ] **Step 7: 实现 SequencePlayer 组件**

`SequencePlayer.jsx`（用 `setTimeout` 链按 `beats` 推进；每拍时长 `60000 / tempo` 毫秒，默认 tempo=90；休止只推进不发音；`onNote(note, index)` 供外部同步高亮；组件卸载时清理定时器）：

```jsx
import { useEffect, useRef, useState } from 'react'

export default function SequencePlayer({ notes, synth, tempo = 90, onNote, onEnd, run }) {
  const [index, setIndex] = useState(0)
  const timers = useRef([])
  const beatMs = 60000 / tempo

  useEffect(() => {
    if (!run) return
    let i = 0
    const schedule = () => {
      if (i >= notes.length) { onEnd?.(); return }
      const note = notes[i]
      setIndex(i)
      onNote?.(note, i)
      if (note.chord) synth.playChord(note.chord)
      else if (note.midi !== null) synth.play(note.midi)
      const delay = Math.max(120, note.beats * beatMs)
      timers.current.push(setTimeout(() => { i += 1; schedule() }, delay))
    }
    schedule()
    return () => { timers.current.forEach(clearTimeout); timers.current = [] }
  }, [run])

  return null
}
```

- [ ] **Step 8: 给 Piano / Sheet 添加样式（components.css）**

创建 `piano-studio/src/styles/components.css` 并在 `global.css` 末尾 `@import './components.css';`。样式要点：
- `.piano`：相对定位，白键底部圆角 6px，边框 `var(--line)`；水平溢出可滚动（移动端包一层 `.piano-scroll`）。
- `.piano-key`：`position:relative`；`.white` 高 180px、白底、左侧边框；`.black` 绝对定位、宽 6%、高 110px、`--ink` 底色、顶部圆角 6px。
- `.piano-key.is-highlight`：背景 `var(--amber)` 呼吸动画（`@keyframes breathe { 50% { filter: brightness(1.25) } }`，1.2s 循环）。
- `.piano-key.is-active`：背景稍深。
- `.sheet`：flex 换行、间距 4px；`.sheet-note.is-current`：背景 `var(--amber)`、圆角 6px、放大 1.15 倍。
- `.sheet-chord`：纵向 flex；`.sheet-dash`：颜色 `var(--ink-muted)`。

- [ ] **Step 9: 验证构建**

运行 `npm run build`。预期：成功，无报错。

- [ ] **Step 10: Commit**

```bash
git add piano-studio/src/lib/keys.js piano-studio/src/lib/keys.test.js piano-studio/src/components piano-studio/src/styles/components.css
git commit -m "feat: add piano keyboard, sheet display and sequence player components"
```

---

### Task 7: 跟练组件 Practice

**Files:**
- Create: `piano-studio/src/components/Practice.jsx`
- Modify: `piano-studio/src/styles/components.css`

**Interfaces:**
- Consumes: `parseExercise`、`practiceReducer/createInitialPractice/starsFor`、`createPianoSynth`、`Piano`、`SheetDisplay`、`SequencePlayer`、`KEY_TO_MIDI`、`getExerciseNotes`。
- Produces: `Practice({ exerciseId, onComplete? })`：内部完成一个练习后调用 `onComplete(exerciseId, stars)`；渲染标题、简谱、虚拟键盘、控制按钮（▶ 演示 / ↺ 重置）与完成反馈（星级）。

- [ ] **Step 1: 实现 Practice 组件**

`Practice.jsx` 要点：
- `useMemo` 解析 `getExerciseNotes(exerciseId)` 并 `createInitialPractice`；`useReducer` 管理状态。
- 键盘输入：`useEffect` 挂 `window` keydown，事件 key 转小写后查 `KEY_TO_MIDI`，命中则 `dispatch({type:'input', midi})`；仅当练习状态为 `ready` 或 `wrong` 时处理；错误提示显示 600ms 后 `wrong-clear`。
- 点击琴键走同一 `input` 分支；同时用 `synth.play(midi)` 播放反馈音（仅在按对时由音频反馈，按错播放低沉短音 `synth.play(48)`）。
- 演示模式：点击「演示」置 `demoRun=true`，`SequencePlayer run={demoRun}`；`onNote` 同步高亮当前音符；`onEnd` 时 `demoRun=false` 并 `reset`。
- 完成时：`stars = starsFor(state.mistakes)`，调用 `onComplete`，显示「完成！N 颗星」与「再练一次」按钮。
- 高亮传给 Piano：`state.notes[state.index]?.chord ?? [state.notes[state.index]?.midi]`。

```jsx
import { useEffect, useMemo, useReducer, useRef, useState } from 'react'
import Piano from './Piano.jsx'
import SheetDisplay from './SheetDisplay.jsx'
import SequencePlayer from './SequencePlayer.jsx'
import { getExerciseNotes } from '../data/exercises.js'
import { createInitialPractice, practiceReducer, starsFor } from '../lib/practice.js'
import { createPianoSynth } from '../lib/audio.js'
import { KEY_TO_MIDI } from '../lib/keys.js'

export default function Practice({ exerciseId, onComplete }) {
  const notes = useMemo(() => getExerciseNotes(exerciseId), [exerciseId])
  const [state, dispatch] = useReducer(practiceReducer, notes, createInitialPractice)
  const [demoRun, setDemoRun] = useState(false)
  const [wrongTick, setWrongTick] = useState(0)
  const synthRef = useRef(null)
  if (!synthRef.current) synthRef.current = createPianoSynth()
  const synth = synthRef.current

  useEffect(() => {
    const onKey = (e) => {
      const midi = KEY_TO_MIDI[e.key.toLowerCase()]
      if (midi === undefined) return
      e.preventDefault()
      handleInput(midi)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [state])

  useEffect(() => {
    if (state.status === 'done') onComplete?.(exerciseId, starsFor(state.mistakes))
  }, [state.status])

  const current = state.notes[state.index]
  const highlight = current
    ? (current.chord ?? (current.midi !== null ? [current.midi] : []))
    : []

  function handleInput(midi) {
    if (state.status === 'done') return
    const note = state.notes[state.index]
    const target = note.chord ?? (note.midi !== null ? [note.midi] : [])
    if (target.includes(midi)) {
      synth.play(midi)
    } else {
      synth.play(48)
      setWrongTick((t) => t + 1)
      setTimeout(() => dispatch({ type: 'wrong-clear' }), 650)
    }
    dispatch({ type: 'input', midi })
  }

  const stars = state.status === 'done' ? starsFor(state.mistakes) : null

  return (
    <section className="practice card">
      <SheetDisplay notes={state.notes} currentIndex={state.index} />
      <div className="piano-scroll">
        <Piano
          highlight={highlight}
          active={[]}
          onPlay={handleInput}
        />
      </div>
      <div className="practice-controls">
        <button className="btn btn-ghost" onClick={() => { setDemoRun(true); dispatch({ type: 'reset' }) }}>
          ▶ 演示
        </button>
        <button className="btn btn-ghost" onClick={() => dispatch({ type: 'reset' })}>
          ↺ 重置
        </button>
        {state.status === 'wrong' && <span className="practice-feedback" key={wrongTick}>再试一次，注意看高亮的键</span>}
      </div>
      {state.status === 'done' && (
        <div className="practice-done">
          <p>完成！{starsFor(state.mistakes)} 颗星</p>
          <button className="btn" onClick={() => dispatch({ type: 'reset' })}>
            再练一次
          </button>
        </div>
      )}
      <SequencePlayer
        notes={notes}
        synth={synth}
        run={demoRun}
        onNote={(note, i) => dispatch({ type: 'demo-advance' })}
        onEnd={() => { setDemoRun(false); dispatch({ type: 'reset' }) }}
      />
    </section>
  )
}
```

注意：`onNote` 中 `demo-advance` 会与播放同步推进；演示结束调用一次 `reset` 让用户从头跟练。上述代码中 `dispatch({type:'demo-advance'})` 与 `SequencePlayer` 内部 `setIndex` 独立，互不冲突（SheetDisplay 高亮使用 reducer 的 `index`）。

- [ ] **Step 2: 补充样式**

在 `components.css` 追加：`.practice` 布局（标题区、控制条 flex、`.btn-ghost` 白底木色描边、`.practice-feedback` 琥珀色文字、`.practice-done` 居中）。

- [ ] **Step 3: 验证构建**

运行 `npm run build`。预期：成功。

- [ ] **Step 4: Commit**

```bash
git add piano-studio/src/components/Practice.jsx piano-studio/src/styles/components.css
git commit -m "feat: add guided practice component with demo mode and stars"
```

---

### Task 8: 课程详情页 LessonPage

**Files:**
- Create: `piano-studio/src/components/AnimatedDemo.jsx`
- Create: `piano-studio/src/components/ExerciseSection.jsx`
- Modify: `piano-studio/src/pages/LessonPage.jsx`
- Modify: `piano-studio/src/styles/components.css`

**Interfaces:**
- Consumes: `getLesson`、`exercises`、`getExerciseNotes`、`Practice`、`progress`（`loadProgress`/`markLessonCompleted`/`saveProgress`）。
- Produces: `AnimatedDemo({ block })`（`demoKind:'posture'` 渲染手型 SVG 动画；`'highlight'` 渲染一个迷你 Piano 自动循环高亮 `block.notes` 解析结果，不发声或点击发声）；`ExerciseSection({ lessonId, exercise, onComplete })` 渲染练习标题 + `Practice`，并维护“本课练习完成集合”；`LessonPage` 组合讲解区 + 练习区 + 完成本课按钮。

- [ ] **Step 1: 实现 AnimatedDemo**

`AnimatedDemo.jsx`：
- `posture`：内联 SVG（侧面手的轮廓 + 琴键横条），用 CSS `@keyframes hand-breathe` 让手轻微上下浮动；配一句说明文字。
- `highlight`：用 `useMemo` 解析 `block.notes`，渲染 `Piano highlight={currentMidi}` + 一个 1.5s 循环定时器让高亮在音符序列中移动；点击琴键可发声（`createPianoSynth()`）。

```jsx
import { useEffect, useMemo, useRef, useState } from 'react'
import Piano from './Piano.jsx'
import { parseExercise } from '../lib/notes.js'
import { createPianoSynth } from '../lib/audio.js'

export default function AnimatedDemo({ block }) {
  if (block.demoKind === 'posture') {
    return (
      <div className="demo demo-posture" aria-label="手型示意">
        <svg viewBox="0 0 320 120" role="img">
          <rect x="20" y="82" width="280" height="18" rx="4" fill="#FAF6EF" stroke="#8A8178" />
          <rect x="40" y="88" width="10" height="12" fill="#3D3A36" />
          <rect x="80" y="88" width="10" height="12" fill="#3D3A36" />
          <rect x="120" y="88" width="10" height="12" fill="#3D3A36" />
          <g className="hand">
            <ellipse cx="160" cy="52" rx="46" ry="20" fill="#D9A066" />
            <ellipse cx="126" cy="58" rx="9" ry="16" fill="#D9A066" transform="rotate(-18 126 58)" />
            <ellipse cx="146" cy="44" rx="8" ry="17" fill="#D9A066" transform="rotate(-6 146 44)" />
            <ellipse cx="168" cy="42" rx="8" ry="18" fill="#D9A066" transform="rotate(8 168 42)" />
            <ellipse cx="190" cy="48" rx="8" ry="16" fill="#D9A066" transform="rotate(24 190 48)" />
            <ellipse cx="202" cy="60" rx="9" ry="13" fill="#D9A066" transform="rotate(42 202 60)" />
          </g>
        </svg>
        <p>手腕与手背齐平，手指自然弯曲，像握着一个鸡蛋。</p>
      </div>
    )
  }
  return <HighlightDemo notes={block.notes} />
}

function HighlightDemo({ notes: raw }) {
  const notes = useMemo(() => parseExercise(raw), [raw])
  const [i, setI] = useState(0)
  const synthRef = useRef(null)
  if (!synthRef.current) synthRef.current = createPianoSynth()

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % Math.max(notes.length, 1)), 900)
    return () => clearInterval(t)
  }, [notes])

  const current = notes[i]
  const highlight = current ? (current.chord ?? (current.midi !== null ? [current.midi] : [])) : []
  return (
    <div className="demo demo-highlight">
      <Piano highlight={highlight} onPlay={(m) => synthRef.current.play(m)} />
    </div>
  )
}
```

- [ ] **Step 2: 实现 ExerciseSection**

`ExerciseSection.jsx`：

```jsx
import Practice from './Practice.jsx'

export default function ExerciseSection({ exercise, onComplete }) {
  return (
    <section className="exercise">
      <h3>{exercise.title}</h3>
      <Practice exerciseId={exercise.id} onComplete={onComplete} />
    </section>
  )
}
```

- [ ] **Step 3: 实现 LessonPage**

`LessonPage.jsx` 要点：
- `useParams` 取 `id`，`getLesson(id)` 找不到时渲染「课程不存在」+ 返回课程列表链接。
- `progress` 用 `useState(() => loadProgress())`；任一练习 `onComplete` 时把该练习 id 记入本地 `doneExercises` 集合。
- 当 `doneExercises.size >= lesson.exerciseIds.length`，显示「完成本课」按钮；点击后 `markLessonCompleted(progress, lesson.id, starsFor(0))`（星级取本课练习中最低星级）并 `saveProgress`，随后显示「本课已学完 ✓」。
- 讲解区渲染 `intro`：`p` → `<p>`；`tip` → `<aside className="tip">`；`demo` → `<AnimatedDemo block={...} />`。
- 顶部：返回 `/lessons` 链接、阶段徽标、`第 N 课`、标题、目标框。

```jsx
import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getLesson } from '../data/lessons.js'
import { stages } from '../data/stages.js'
import { exercises } from '../data/exercises.js'
import AnimatedDemo from '../components/AnimatedDemo.jsx'
import ExerciseSection from '../components/ExerciseSection.jsx'
import { loadProgress, markLessonCompleted, saveProgress } from '../lib/progress.js'
import { starsFor } from '../lib/practice.js'

export default function LessonPage() {
  const { id } = useParams()
  const lesson = getLesson(id)
  const [progress, setProgress] = useState(() => loadProgress())
  const [done, setDone] = useState(() => new Set())

  const stage = useMemo(() => stages.find((s) => s.id === lesson?.stage), [lesson])
  if (!lesson) {
    return (
      <main className="page">
        <h1>课程不存在</h1>
        <Link className="btn" to="/lessons">返回课程列表</Link>
      </main>
    )
  }

  const allDone = done.size >= lesson.exerciseIds.length
  const completed = Boolean(progress.completed[lesson.id])

  const finishLesson = () => {
    const stars = Math.min(...lesson.exerciseIds.map((eid) => progress.completed[`${lesson.id}:${eid}`]?.stars ?? 1), 1)
    const next = markLessonCompleted(progress, lesson.id, stars)
    saveProgress(next)
    setProgress(next)
  }

  return (
    <main className="page lesson-page">
      <Link to="/lessons" className="back-link">← 返回课程列表</Link>
      <span className="stage-badge" style={{ background: stage.accent }}>阶段{stage.id} · {stage.title}</span>
      <h1>第 {lesson.order} 课 · {lesson.title}</h1>
      <div className="goal card">学习目标：{lesson.goal}</div>

      <section className="lesson-intro">
        {lesson.intro.map((block, i) => {
          if (block.type === 'demo') return <AnimatedDemo key={i} block={block} />
          if (block.type === 'tip') return <aside key={i} className="tip">{block.text}</aside>
          return <p key={i}>{block.text}</p>
        })}
      </section>

      <h2>跟练练习</h2>
      {lesson.exerciseIds.map((eid) => (
        <ExerciseSection
          key={eid}
          exercise={exercises[eid]}
          onComplete={(exerciseId, stars) => {
            setDone((prev) => new Set(prev).add(exerciseId))
            setProgress((p) => {
              const next = { ...p, completed: { ...p.completed, [`${lesson.id}:${exerciseId}`]: { stars, doneAt: new Date().toISOString().slice(0, 10) } } }
              saveProgress(next)
              return next
            })
          }}
        />
      ))}

      <div className="lesson-finish">
        {completed ? (
          <p className="completed-note">本课已学完 ✓</p>
        ) : allDone ? (
          <button className="btn" onClick={finishLesson}>完成本课</button>
        ) : (
          <p className="muted">完成全部练习后即可打卡本课</p>
        )}
      </div>
    </main>
  )
}
```

- [ ] **Step 4: 补充样式**

在 `components.css` 追加：`.lesson-intro`（max-width 680px）、`.tip`（琥珀色左边框背景块）、`.stage-badge`（胶囊白字）、`.goal`、`.lesson-finish`（居中）、`.demo-posture .hand`（`animation: hand-breathe 2.4s ease-in-out infinite alternate` + `@keyframes` 位移 0–3px）、`.back-link`。

- [ ] **Step 5: 验证构建**

运行 `npm run build`。预期：成功。

- [ ] **Step 6: Commit**

```bash
git add piano-studio/src/components/AnimatedDemo.jsx piano-studio/src/components/ExerciseSection.jsx piano-studio/src/pages/LessonPage.jsx piano-studio/src/styles/components.css
git commit -m "feat: build lesson detail page with demos, exercises and completion flow"
```

---

### Task 9: 首页、课程列表、学习指南与导航

**Files:**
- Create: `piano-studio/src/components/Header.jsx`
- Create: `piano-studio/src/components/Footer.jsx`
- Modify: `piano-studio/src/pages/HomePage.jsx`
- Modify: `piano-studio/src/pages/LessonsPage.jsx`
- Modify: `piano-studio/src/pages/GuidePage.jsx`
- Modify: `piano-studio/src/styles/components.css`

**Interfaces:**
- Consumes: `lessons`/`lessonsByStage`/`stages`/`getLesson`、`loadProgress`/`nextLesson`、`Link`。
- Produces: `Header`（logo + 导航 + 进度概览「已完成 n/24」）、`Footer`；完整 `HomePage` / `LessonsPage` / `GuidePage`。

- [ ] **Step 1: 实现 Header 与 Footer**

`Header.jsx`（固定在顶部、米白半透明背景、柔阴影；导航高亮当前路由用 `NavLink`；进度从 `loadProgress()` 读取）：

```jsx
import { NavLink } from 'react-router-dom'
import { loadProgress } from '../lib/progress.js'
import { lessons } from '../data/lessons.js'

export default function Header() {
  const progress = loadProgress()
  const doneCount = Object.keys(progress.completed).filter((id) => /^lesson-\d+$/.test(id)).length
  const canStore = (() => {
    try {
      const k = '__piano_probe__'
      globalThis.localStorage?.setItem(k, '1')
      globalThis.localStorage?.removeItem(k)
      return true
    } catch {
      return false
    }
  })()
  return (
    <header className="site-header">
      <NavLink to="/" className="logo">
        <svg width="28" height="28" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="7" fill="#8B6B52" />
          <rect x="4" y="10" width="24" height="15" rx="2" fill="#FAF6EF" />
          <rect x="7" y="18" width="3" height="7" fill="#3D3A36" />
          <rect x="12" y="18" width="3" height="7" fill="#3D3A36" />
          <rect x="17" y="18" width="3" height="7" fill="#3D3A36" />
          <rect x="22" y="18" width="3" height="7" fill="#3D3A36" />
        </svg>
        <span>Piano Studio</span>
      </NavLink>
      <nav className="site-nav">
        <NavLink to="/">首页</NavLink>
        <NavLink to="/lessons">课程</NavLink>
        <NavLink to="/guide">学习指南</NavLink>
      </nav>
      <span className="header-progress">已完成 {doneCount}/{lessons.length}</span>
      {!canStore && <p className="storage-hint">当前浏览器无法保存进度，刷新后进度会丢失。</p>}
    </header>
  )
}
```

`Footer.jsx`（底部：站名 + 「纯静态站点 · 进度保存在本机浏览器」 + 版权行）。

修改 `App.jsx`：把 `Header`/`Footer` 全局包在 `<Routes>` 外层，所有页面不再各自渲染它们：

```jsx
import { Routes, Route, Link } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import HomePage from './pages/HomePage.jsx'
import LessonsPage from './pages/LessonsPage.jsx'
import LessonPage from './pages/LessonPage.jsx'
import GuidePage from './pages/GuidePage.jsx'

function NotFound() {
  return (
    <main className="page">
      <h1>页面不存在</h1>
      <Link className="btn" to="/">返回首页</Link>
    </main>
  )
}

export default function App() {
  return (
    <div className="app">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/lessons/:id" element={<LessonPage />} />
        <Route path="/guide" element={<GuidePage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}
```

- [ ] **Step 2: 实现 HomePage**

`HomePage.jsx` 要点：
- Hero：衬线大字「从零开始，弹出第一首歌」+ 副标题 + 「开始学习」按钮（→ `/lessons`）。
- 继续学习横幅：`nextLesson(lessons.map(l => l.id), progress)` 有值则显示「继续学习：第 N 课 · 标题」按钮；全部完成则显示「全部课程已完成 🎉」。
- 三阶段卡片：遍历 `stages`，用 `lessonsByStage` 取课程数，点击 → `/lessons`。
- 新手须知卡片：三条（每天 10–15 分钟、先慢后快、错了没关系）。

```jsx
import { Link } from 'react-router-dom'
import { lessons } from '../data/lessons.js'
import { stages } from '../data/stages.js'
import { loadProgress, nextLesson } from '../lib/progress.js'

export default function HomePage() {
  const progress = loadProgress()
  const next = nextLesson(lessons.map((l) => l.id), progress)
  return (
    <main className="page home">
        <section className="hero">
          <h1>从零开始，弹出第一首歌</h1>
          <p className="hero-sub">没有乐理基础？没关系。24 课循序渐进，每课都有键盘跟练，打开就能学。</p>
          <Link className="btn" to="/lessons">开始学习</Link>
        </section>

        {next && (
          <section className="continue card">
            <p>继续学习</p>
            <Link className="btn" to={`/lessons/${next}`}>第 {lessons.find((l) => l.id === next).order} 课 · {lessons.find((l) => l.id === next).title}</Link>
          </section>
        )}

        <section className="stages">
          <h2>三阶段学习路径</h2>
          <div className="stage-grid">
            {stages.map((s) => (
              <Link key={s.id} to="/lessons" className="card stage-card" style={{ borderTop: `4px solid ${s.accent}` }}>
                <h3>阶段{s.id} · {s.title}</h3>
                <p>{s.range} · {s.summary}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="tips card">
          <h2>给新手的三句话</h2>
          <ul>
            <li>每天 10–15 分钟，比周末练两小时更有效。</li>
            <li>先慢后快，速度是慢慢长出来的。</li>
            <li>弹错了很正常，停下来重新开始就好。</li>
          </ul>
        </section>
    </main>
  )
}
```

- [ ] **Step 3: 实现 LessonsPage**

`LessonsPage.jsx`：按阶段分组渲染课程卡片（`Link` 到 `/lessons/:id`），卡片显示编号、标题、已学 ✓ 徽标；顶部显示总进度条（完成数/24）。

```jsx
import { Link } from 'react-router-dom'
import { lessons, lessonsByStage } from '../data/lessons.js'
import { stages } from '../data/stages.js'
import { loadProgress } from '../lib/progress.js'

export default function LessonsPage() {
  const progress = loadProgress()
  const doneCount = Object.keys(progress.completed).filter((id) => /^lesson-\d+$/.test(id)).length
  return (
    <main className="page lessons-page">
        <h1>全部课程</h1>
        <div className="progress-bar"><span style={{ width: `${(doneCount / lessons.length) * 100}%` }} /></div>
        <p className="muted">已完成 {doneCount}/{lessons.length} 课</p>
        {stages.map((stage) => (
          <section key={stage.id} className="stage-group">
            <h2>阶段{stage.id} · {stage.title} <small>{stage.range}</small></h2>
            <div className="lesson-grid">
              {lessonsByStage(stage.id).map((lesson) => {
                const done = Boolean(progress.completed[lesson.id])
                return (
                  <Link key={lesson.id} to={`/lessons/${lesson.id}`} className="card lesson-card">
                    <span className="lesson-no">第 {lesson.order} 课</span>
                    <h3>{lesson.title}</h3>
                    <p>{lesson.goal}</p>
                    {done && <span className="done-badge">已学 ✓</span>}
                  </Link>
                )
              })}
            </div>
          </section>
        ))}
    </main>
  )
}
```

- [ ] **Step 4: 实现 GuidePage**

`GuidePage.jsx`：四个区块卡片——坐姿与手型（复用 `AnimatedDemo` posture）、简谱速查表（table：数字/唱名/时值/本站写法）、练琴习惯（列表）、常见问题（dl：设备没声音怎么办 / 需要真钢琴吗 / 多久能学会）。

```jsx
import AnimatedDemo from '../components/AnimatedDemo.jsx'

export default function GuidePage() {
  return (
    <main className="page guide-page">
        <h1>学习指南</h1>
        <section className="card">
          <h2>坐姿与手型</h2>
          <AnimatedDemo block={{ type: 'demo', demoKind: 'posture' }} />
        </section>
        <section className="card">
          <h2>简谱速查表</h2>
          <table className="sheet-table">
            <thead><tr><th>数字</th><th>唱名</th><th>本站写法</th><th>时值</th></tr></thead>
            <tbody>
              <tr><td>1 2 3 4 5 6 7</td><td>do re mi fa sol la si</td><td>1–7</td><td>默认 1 拍</td></tr>
              <tr><td>1-</td><td>do（延长）</td><td>1-</td><td>2 拍</td></tr>
              <tr><td>1_</td><td>do（八分）</td><td>1_</td><td>半拍</td></tr>
              <tr><td>0</td><td>休止</td><td>0</td><td>1 拍（不发声）</td></tr>
              <tr><td>1' / 1,</td><td>高音 do / 低音 do</td><td>1' / 1,</td><td>高/低八度</td></tr>
            </tbody>
          </table>
        </section>
        <section className="card">
          <h2>练琴习惯</h2>
          <ul>
            <li>固定时间：每天同一时段练琴更容易坚持。</li>
            <li>先热身：两分钟手指爬梯再练曲子。</li>
            <li>分段练：一句一句来，别整首硬啃。</li>
          </ul>
        </section>
        <section className="card">
          <h2>常见问题</h2>
          <dl>
            <dt>网页没声音？</dt><dd>点击键盘任意键会初始化音频；请检查浏览器音量与系统音量。</dd>
            <dt>没有真钢琴可以学吗？</dt><dd>可以先用本站练习；有条件时推荐电钢琴或钢琴。</dd>
            <dt>多久能学会？</dt><dd>每天 15 分钟，大约 1–2 个月可完成全部 24 课。</dd>
          </dl>
        </section>
    </main>
  )
}
```

- [ ] **Step 5: 补充样式与响应式**

`components.css` 追加：`.site-header`（flex、sticky、`background: rgba(250,246,239,.92)`、backdrop-filter blur、底部 1px `--line`）、`.logo`、`.site-nav a.active`（木色下划线）、`.storage-hint`（琥珀色小字）、`.hero`（居中、大标题 38px、副标题 muted）、`.stage-grid`/`.lesson-grid`（grid：桌面 3 列 / 移动 1 列，`repeat(auto-fill, minmax(240px, 1fr))`）、`.progress-bar`（4px 圆角轨道 + 木色填充）、`.sheet-table`（全宽、`--line` 边框、斑马纹）、`.lesson-card`（相对定位，`.done-badge` 右上角苔藓绿胶囊）。媒体查询 `@media (max-width: 640px)` 调整 hero 字号与 header 换行。

- [ ] **Step 6: 验证构建**

运行 `npm run build`。预期：成功。

- [ ] **Step 7: Commit**

```bash
git add piano-studio/src/components/Header.jsx piano-studio/src/components/Footer.jsx piano-studio/src/pages piano-studio/src/styles/components.css piano-studio/src/App.jsx
git commit -m "feat: build home, lesson list and guide pages with header and footer"
```

---

### Task 10: README、收尾验证与修复

**Files:**
- Create: `piano-studio/README.md`
- Modify: 修复构建/测试中发现的问题

**Interfaces:**
- Consumes: 全部已实现模块。

- [ ] **Step 1: 写 README**

`README.md` 包含：项目简介、本地运行（`npm install` / `npm run dev` / `npm test` / `npm run build`）、目录结构、课程体系说明、简谱写法说明（1–7、`'`/`,`、`_`/`-`/`.`、`[ ]` 和弦）、进度存储说明（localStorage，无账号）、曲目版权说明（公版经典 + 《月亮代表我的心》简化改编，公开部署前可替换）。

- [ ] **Step 2: 运行全部测试**

运行 `npm test`。预期：notes / progress / practice / keys / data 全部 PASS。

- [ ] **Step 3: 构建检查**

运行 `npm run build`。预期：成功、无报错。打开 `dist/index.html` 确认资源路径为相对路径（`./assets/...`）。

- [ ] **Step 4: 浏览器走查（桌面 + 移动）**

运行 `npm run dev`，用 Playwright（复用仓库根目录 `node_modules/playwright-core` 或安装后使用）截图走查：
- 首页 → 课程列表 → 课程详情（第 1 课）→ 点击键盘键/按电脑键练习 → 演示模式 → 完成练习 → 完成本课 → 首页「继续学习」更新为第 2 课。
- 移动端视口（375×667）：键盘可横向滚动、布局无溢出。
- 修复发现的问题后重新构建、测试，再走查一次。

- [ ] **Step 5: Commit**

```bash
git add piano-studio/README.md
git commit -m "docs: add Piano Studio README with run and content notes"
```

- [ ] **Step 6: 更新根 README（可选一行）**

在仓库根 `README.md` 末尾追加一行「另见：[piano-studio/](piano-studio/) 零基础钢琴自学网站」并提交（仅追加，不改动现有内容）。

---

## Self-Review 结论

对照设计文档逐项核对：
- 站点结构（首页/课程/课程详情/学习指南）→ Task 1、8、9。
- 24 课三阶段课程体系与每课练习 → Task 5。
- 跟练模式（简谱高亮、键盘提示、按对前进、演示、星级）→ Task 4、6、7。
- 视觉设计令牌与字体 → Task 1、6（组件样式）、9（响应式）。
- 技术架构（Vite+React、localStorage、Web Audio、纯静态）→ Task 1–4。
- 测试与验收（单元测试、构建、浏览器走查、无障碍）→ 各 Task 测试步骤 + Task 10。
- 简谱解析规则在 notes.test / data.test 中锁定；练习音域 C3–E5 由 data.test 断言。
