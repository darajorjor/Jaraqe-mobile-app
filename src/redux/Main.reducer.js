// @flow
const LOAD = 'looney-toons/app/LOAD'
const SET_PROFILE = 'looney-toons/app/SET_PROFILE'
const SET_SESSION = 'looney-toons/app/SET_SESSION'

const initialState = {
  loading: false,
  profile: null,
  session: null,
}

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: action.data === 100 ? false : action.data,
      }
    case SET_PROFILE:
      return {
        ...state,
        profile: action.data,
      }
    case SET_SESSION:
      return {
        ...state,
        session: action.data,
      }
    default:
      return state
  }
}

export function load(data) {
  return {
    type: LOAD,
    data,
  }
}

export function setProfile(data) {
  return {
    type: SET_PROFILE,
    data,
  }
}

export function setSession(data) {
  return {
    type: SET_SESSION,
    data,
  }
}
