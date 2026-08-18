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
