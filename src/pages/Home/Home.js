import React from 'react'
import PropTypes from 'prop-types'
import {
  View,
  Button,
} from 'react-native'
import { navigate } from 'src/utils/helpers/navigation.helper'
import { connect } from 'react-redux'
import Navbar from 'src/common/Navbar'
import Games from './components/Games'
import api from 'src/utils/ApiHOC'
import { autobind } from 'core-decorators'
import Jext from 'src/common/Jext'
import Avatar from 'src/common/Avatar'
import debounce from 'lodash/debounce'
import { getSetProfile } from 'src/redux/Main.reducer'
import { setToStore } from 'src/utils/ApiHOC/redux'

@connect(
  state => ({
    profile: state.Main.profile,
  }),
  { getSetProfile, setToStore }
)
@api({
  url: 'games/smart-match',
  method: 'POST',
  name: 'smartMatch',
})
@autobind
export default class Home extends React.Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.init = debounce(this.init, 1000);
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'willAppear':
        break;
      case 'didAppear':
        this.init();
        break;
      case 'willDisappear':
        break;
      case 'didDisappear':
        break;
    }
  }

  init() {
    this.props.getSetProfile()
  }

  startNewGame(type) {
    const { data: { smartMatch }, setToStore } = this.props
    const { store } = this.context

    const { games } = store.getState().ApiHOC.root

    switch (type) {
      case 'smart-matching':
        smartMatch()
          .then(({ game }) => {
            games.push(game)
            setToStore('games', games)
            this.openGame(game)
          })
    }
  }

  openGame(game) {
    return navigate({
      navigator: this.props.navigator,
      screen: 'Game',
      method: 'push',
      options: {
        passProps: {
          game
        },
        navigatorStyle: {
          drawUnderTabBar: true,
          navBarHidden: true,
          tabBarHidden: true,
        }
      }
    })
  }

  render() {
    const { profile, data: { smartMatchLoading } } = this.props

    return (
      <View style={{ flex: 1, }}>
        <Navbar
          rightElement={
            profile &&
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
              <View style={{ alignItems: 'center' }}>
                <Jext>{profile.fullName}</Jext>
                <Jext onPress={() => navigate({
                  screen: 'UserProfile',
                  method: 'showModal',
                  options: {
                    passProps: {
                      profile,
                    }
                  }
                })
                } style={{ color: '#007aff' }}>مشاهده پروفایل</Jext>
              </View>
              <Avatar
                source={{ uri: profile.avatar }}
                online={profile.isOnline}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginLeft: 10,
                }}
              />

            </View>
          }
          leftElement={profile && <Jext>{ profile.coins } کبریت</Jext>}
        />

        <Games
          userId={profile._id}
          onGamePress={game => this.openGame(game)}
        />

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Button
            title='بازی جدید'
            onPress={() => this.startNewGame('smart-matching')}
            disabled={smartMatchLoading}
          />
        </View>

      </View>
    )
  }
}