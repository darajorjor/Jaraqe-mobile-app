// @flow
import ApiCaller from 'src/utils/ApiCaller'
import OneSignal from 'react-native-onesignal'
import { Platform } from 'react-native'
import _ from 'lodash'

const api = new ApiCaller()

const LOAD = 'jaraqe/app/LOAD'
const SET_PROFILE = 'jaraqe/app/SET_PROFILE'
const SET_SESSION = 'jaraqe/app/SET_SESSION'
const SET_PROFILE_FIELD = 'jaraqe/app/SET_PROFILE_FIELD'

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
    case SET_PROFILE_FIELD:
      _.set(state.profile, action.data.field, action.data.data)

      return {
        ...state,
        profile: { ...state.profile},
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

export function setProfileField(field, data) {
  return {
    type: SET_PROFILE_FIELD,
    data: {
      field,
      data,
    },
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
