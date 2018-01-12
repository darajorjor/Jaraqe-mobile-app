/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { UIManager, Platform } from 'react-native';
import { registerScreens } from './screens';
import { navigate } from 'src/helpers/navigation.helper';

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true);
}

console.disableYellowBox = true;

registerScreens(); // this is where you register all of your app's screens

async function initialize() {
  await navigate({
    method: 'startTabBasedApp',
    options: {
      tabs: [
        {
          label: 'پروفایل',
          screen: 'jaraqe.Home',
          title: 'پروفایل',
          icon: require('./icon.png'),
          // selectedIcon: iconsMap[ 'md-person' ],
          navigatorStyle: {
            navBarHidden: true,
          },
        },
        {
          label: 'پیام‌ها',
          screen: 'jaraqe.Home',
          title: 'پیام‌ها',
          icon: require('./icon.png'),
          // selectedIcon: iconsMap[ 'md-mail-open' ],
          navigatorStyle: {
            navBarHidden: true
          },
        },
        {
          label: 'سفرها',
          screen: 'jaraqe.Home',
          title: 'سفرها',
          icon: require('./icon.png'),
          // selectedIcon: iconsMap[ 'md-briefcase' ],
          navigatorStyle: {
            navBarHidden: true
          },
        },
        {
          label: 'خانه',
          screen: 'jaraqe.Game', // this is a registered name for a screen
          title: 'خانه',
          icon: require('./icon.png'),
          // selectedIcon: iconsMap[ 'md-home' ],
          navigatorStyle: {
            navBarHidden: true,
            drawUnderTabBar: true,
            tabBarHidden: true,
          },
        }
      ],
      tabsStyle: { // styling iOS
        tabBarTextFontFamily: 'IRANYekanFaNum', //change the tab font family

        tabBarSelectedButtonColor: '#00928F', // change the color of the selected tab icon and text (only selected)
        tabBarButtonColor: '#9e9e9e', // change the color of the selected tab icon and text (only selected)

        tabBarLabelColor: '#9e9e9e', // change the color of the selected tab icon and text (only selected)
        tabBarSelectedLabelColor: '#00928F', // change the color of the selected tab icon and text (only selected)

        tabBarBackgroundColor: '#fff', // change the background color of the tab bar
        tabBarTranslucent: true, // change the translucent of the tab bar to false
        forceTitlesDisplay: true, // Android only. If true - Show all bottom tab labels. If false - only the selected tab's label is visible.
        tabBarHideShadow: false, // iOS only. Remove default tab bar top shadow (hairline)
        initialTabIndex: 3,
      },
      appStyle: { // styling android
        tabBarBackgroundColor: '#fff',
        tabBarButtonColor: '#9e9e9e',
        tabBarSelectedButtonColor: '#00928F',
        tabBarTranslucent: true,
        tabFontFamily: 'IRANYekanRegular',  // for asset file or use existing font family name
        initialTabIndex: 3,
        forceTitlesDisplay: true,
      },
      portraitOnlyMode: true
    },
  });
}

initialize();