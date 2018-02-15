import React, { Component } from 'react'
import { UIManager, Platform, AsyncStorage } from 'react-native'
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

const api = new ApiCaller()

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
}

console.disableYellowBox = true

registerScreens(store, Provider) // this is where you register all of your app's screens
OneSignal.inFocusDisplaying(0);

export async function initialize() {
  await codepush.sync()
  const session = await getStorageItem('session')

  const locale = await AsyncStorage.getItem('@Jaraqe:locale')
  setLocale(locale)
  await loadIcons()
  if (session) {
    api.get('users/self')
      .then(({ data }) => store.dispatch(setProfile(data)))

    await startApp()
  } else {
    await startLogin()
  }
}

initialize()
  .catch(e => console.error(e))