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
      { type: 'p', text: '歌曲常有大段重复，用 ‖： 和 ：‖ 括起来的部分要再弹一遍；D.C. 表示从头反复。' },
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

export function getLesson(id) {
  return lessons.find((l) => l.id === id) ?? null
}

export function lessonsByStage(stageId) {
  return lessons.filter((l) => l.stage === stageId)
}
