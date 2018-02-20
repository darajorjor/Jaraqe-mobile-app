const LOAD = 'jaraqe/app/LOAD'

const initialState = {
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: action.data === 100 ? false : action.data,
      }
    default:
      return state
  }
}

