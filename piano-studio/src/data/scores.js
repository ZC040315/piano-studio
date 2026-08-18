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
  { id: 'score-16', title: '夜的钢琴曲五', artist: '石进', category: 'instrumental', difficulty: 3, notes: '6 7 1\' 3\' 6 - | 6 7 1\' 3\' 6 - | 2\' 1\' 7 1\' 6 - | 3 5 6 3\' 5 3 5 2\' 1\' -', sourceNote: '简化改编，参考社区简谱' },

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
