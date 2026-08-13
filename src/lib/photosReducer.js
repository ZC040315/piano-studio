export const initialState = { items: [], page: 1, status: 'idle', degraded: false, hasMore: true }

export function photosReducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return { ...state, status: 'loading' }
    case 'OK':
      return {
        ...state,
        status: 'success',
        items: action.append ? [...state.items, ...action.items] : action.items,
        page: action.page,
        hasMore: action.hasMore,
        degraded: false,
      }
    case 'DEGRADED':
      return { ...state, status: 'success', items: action.items, page: 1, hasMore: false, degraded: true }
    case 'ERROR':
      return { ...state, status: 'error' }
    case 'RESET':
      return { ...initialState }
    default:
      return state
  }
}
