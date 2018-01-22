import { Platform } from 'react-native'
import { navigate } from './utils/helpers/navigation.helper'
import { iconsMap } from 'src/utils/loadIcons'

module.exports = {
  startLogin() {
    return navigate({
      method: 'startSingleScreenApp',
      screen: {
        // label: 'فروشگاه',
        screen: 'jaraqe.Login',
        title: 'ورود',
        // icon: require('./icon.png'),
        // selectedIcon: iconsMap[ 'ios-home' ],
        navigatorStyle: {
          // navBarHidden: true,
        }
      },
      options: {
        portraitOnlyMode: true
      },
    })
  },
  startApp() {
    return navigate({
      method: 'startTabBasedApp',
      options: {
        tabs: [
          {
            label: 'فروشگاه',
            screen: 'jaraqe.Store',
            title: 'خانه',
            icon: iconsMap[ 'ios-basket' ],
            selectedIcon: iconsMap[ 'ios-basket' ],
            navigatorStyle: {
              navBarHidden: true,
              // drawUnderTabBar: false,
              // tabBarHidden: true,
            },
          },
          {
            label: 'دوستان',
            screen: 'jaraqe.Friends',
            title: 'پیام‌ها',
            icon: iconsMap[ 'ios-color-filter-outline' ],
            selectedIcon: iconsMap[ 'ios-color-filter-outline' ],
            navigatorStyle: {
              navBarHidden: true
            },
          },
          {
            label: 'خانه',
            screen: 'jaraqe.Home',
            title: 'خانه',
            icon: iconsMap[ 'ios-home' ],
            selectedIcon: iconsMap[ 'ios-home' ],
            navigatorStyle: {
              navBarHidden: true,
              // drawUnderTabBar: false,
              // tabBarHidden: true,
            },
          }
        ],
        tabsStyle: { // styling iOS
          // tabBarJextFontFamily: 'IRANYekanFaNum', //change the tab font family

          // tabBarSelectedButtonColor: '#00928F', // change the color of the selected tab icon and Jext (only selected)
          // tabBarButtonColor: '#9e9e9e', // change the color of the selected tab icon and Jext (only selected)
          //
          // tabBarLabelColor: '#9e9e9e', // change the color of the selected tab icon and Jext (only selected)
          // tabBarSelectedLabelColor: '#00928F', // change the color of the selected tab icon and Jext (only selected)
          //
          // tabBarBackgroundColor: '#fff', // change the background color of the tab bar
          // tabBarTranslucent: true, // change the translucent of the tab bar to false
          // forceTitlesDisplay: true, // Android only. If true - Show all bottom tab labels. If false - only the selected tab's label is visible.
          // tabBarHideShadow: false, // iOS only. Remove default tab bar top shadow (hairline)
          initialTabIndex: 2,
        },
        appStyle: { // styling android
          // tabBarBackgroundColor: '#fff',
          // tabBarButtonColor: '#9e9e9e',
          // tabBarSelectedButtonColor: '#00928F',
          // tabBarTranslucent: true,
          // tabFontFamily: 'IRANYekanRegular',  // for asset file or use existing font family name
          // initialTabIndex: 2,
          // forceTitlesDisplay: true,
        },
        portraitOnlyMode: true
      },
    })
  }
}