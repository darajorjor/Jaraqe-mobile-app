import events from 'src/redux/middlewares/socket/events'
const LOAD = 'jaraqe/app/LOAD'

const initialState = {
  chats: [],
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case events.PLAY_GAME:
      debugger
      return {
        ...state,
        loading: action.data === 100 ? false : action.data,
      }
    default:
      return state
  }
}