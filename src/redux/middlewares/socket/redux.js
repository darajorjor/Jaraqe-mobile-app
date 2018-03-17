import events from './events'

const CONNECTED = 'jaraqe/socket-middleware/CONNECTED'
const DISCONNECTED = 'jaraqe/socket-middleware/DISCONNECTED'
const CONNECTING = 'jaraqe/socket-middleware/CONNECTING'
const ERROR = 'jaraqe/socket-middleware/ERROR'

const initialState = {
  connected: null,
  connecting: null,
  error: null,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case events.WELCOME:
      return {
        ...state,
        connected: true,
        connecting: false,
      }
    case CONNECTING:
      return {
        ...state,
        connected: false,
        connecting: true,
      }
    case DISCONNECTED:
      return {
        ...state,
        connected: false,
        connecting: false,
      }
    case ERROR:
      return {
        ...state,
        connected: false,
        connecting: false,
        error: action.data,
      }
    default:
      return state
  }
}

export function connected() {
  return {
    type: CONNECTED,
  }
}

export function disconnected() {
  return {
    type: DISCONNECTED,
  }
}

export function connecting() {
  return {
    type: CONNECTING,
  }
}

export function error(e) {
  return {
    type: ERROR,
    data: e,
  }
}
