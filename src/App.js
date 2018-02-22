import React, { Component } from 'react'
import { UIManager, Platform, AsyncStorage, TouchableOpacity } from 'react-native'
import { registerScreens } from './screens'
import store from './redux/store'
import { Provider } from 'react-redux'
import { startApp, startLogin } from './navigator'
import getStorageItem from 'src/utils/getStorageItem'
import { loadIcons } from 'src/utils/loadIcons'
import { setProfile } from 'src/redux/Main.reducer'
import ApiCaller from 'src/utils/ApiCaller'
import OneSignal from 'react-native-onesignal'
import { setLocale } from './utils/translate'
import codepush from 'react-native-code-push'
import { navigate } from './utils/helpers/navigation.helper'

const api = new ApiCaller()

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
}

let lastMessage = ''
global.toast = (data) => {
  if (lastMessage === data.title) return null
  lastMessage = data.title
  setTimeout(() => { lastMessage = null }, 5000)
  navigate({
    method: 'showInAppNotification',
    screen: 'Toast',
    options: {
      passProps: data,
    },
  })
}

console.disableYellowBox = true
TouchableOpacity.defaultProps.activeOpacity = 0.7

registerScreens(store, Provider) // this is where you register all of your app's screens
OneSignal.inFocusDisplaying(0);

export async function initialize() {
  await codepush.sync()
  const session = await getStorageItem('session')

  const locale = await AsyncStorage.getItem('@Jaraqe:locale')
  setLocale(locale)
  await loadIcons()
  if (session && !await AsyncStorage.getItem('@Jaraqe:registration_state')) {
    api.get('users/self')
      .then(({ data }) => store.dispatch(setProfile(data)))

    await startApp()
  } else {
    await startLogin()
  }
}

initialize()
  .catch(e => console.error(e))