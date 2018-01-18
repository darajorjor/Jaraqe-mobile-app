import React, { Component } from 'react';
import { UIManager, Platform, Text, AsyncStorage } from 'react-native';
import { registerScreens } from './screens';
import store from './redux/store'
import { Provider } from 'react-redux'
import { startApp, startLogin } from './navigator'
import getStorageItem from 'src/utils/getStorageItem'
import { loadIcons } from 'src/utils/loadIcons'

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}

console.disableYellowBox = true;
Text.defaultProps.allowFontScaling = false

registerScreens(store, Provider); // this is where you register all of your app's screens

async function initialize() {
  const session = await getStorageItem('session')

  await loadIcons()
  if (session) {
    await startApp()
  } else {
    await startLogin()
  }
}

initialize()
  .catch(e => console.error(e));