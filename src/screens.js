import { Navigation } from 'react-native-navigation'

import Home from './pages/Home'
import Game from './pages/Game'
import Login from './pages/Login'
import OAuthLogin from './pages/OAuthLogin'
import Store from './pages/Store'
import Friends from './pages/Friends'
import UserProfile from './pages/UserProfile'
import LoginExtraInfo from './pages/LoginExtraInfo'
import InviteFriends from './pages/InviteFriends'
import Chat from './pages/Chat'
import Toast from './common/Toast'

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  Navigation.registerComponent('jaraqe.Home', () => Home, store, Provider)
  Navigation.registerComponent('jaraqe.Game', () => Game, store, Provider)
  Navigation.registerComponent('jaraqe.Login', () => Login, store, Provider)
  Navigation.registerComponent('jaraqe.OAuthLogin', () => OAuthLogin, store, Provider)
  Navigation.registerComponent('jaraqe.Store', () => Store, store, Provider)
  Navigation.registerComponent('jaraqe.Friends', () => Friends, store, Provider)
  Navigation.registerComponent('jaraqe.UserProfile', () => UserProfile, store, Provider)
  Navigation.registerComponent('jaraqe.LoginExtraInfo', () => LoginExtraInfo, store, Provider)
  Navigation.registerComponent('jaraqe.InviteFriends', () => InviteFriends, store, Provider)
  Navigation.registerComponent('jaraqe.Chat', () => Chat, store, Provider)
  Navigation.registerComponent('jaraqe.Toast', () => Toast, store, Provider)
}