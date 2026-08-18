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
