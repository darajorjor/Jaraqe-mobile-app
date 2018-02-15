const SET = 'jaraqe/ApiHOC/SET'

const initialState = { root: {} }
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET:

      return {
        ...state,
        root: {
          ...state.root,
          [action.data.key]: action.data.data,
        },
      }
    default:
      return state
  }
}

export function setToStore(key, data) {
  return {
    type: SET,
    data: {
      key,
      data,
    },
  }
}