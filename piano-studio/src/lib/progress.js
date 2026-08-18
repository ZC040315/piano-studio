export const STORAGE_KEY = 'piano-studio.progress.v1'

const EMPTY = () => ({ completed: {}, lastLessonId: null })

function safeStorage(storage) {
  try {
    storage.getItem(STORAGE_KEY)
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
