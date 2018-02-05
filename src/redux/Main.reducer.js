// @flow
import ApiCaller from 'src/utils/ApiCaller'
import OneSignal from 'react-native-onesignal'
import { Platform } from 'react-native'

const api = new ApiCaller()

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
  if (Platform.OS === 'android') {
    OneSignal.sendTag("user_id", data.id);
  }
  return {
    type: SET_PROFILE,
    data,
  }
}

export function getSetProfile() {
  return (dispatch, getState) => {
    return api.get('users/self')
      .then(({ data }) => dispatch(setProfile(data)))
  }
}

export function setSession(data) {
  return {
    type: SET_SESSION,
    data,
  }
}
