import { Navigation } from 'react-native-navigation';

import Home from './pages/Home';
import Game from './pages/Game';

// register all screens of the app (including internal ones)
export function registerScreens(store, Provider) {
  Navigation.registerComponent('jaraqe.Home', () => Home, store, Provider);
  Navigation.registerComponent('jaraqe.Game', () => Game, store, Provider);
}