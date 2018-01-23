import React from 'react'
import {
  View,
  Image,
  Button,
} from 'react-native'
import { navigate } from 'src/utils/helpers/navigation.helper'
import { connect } from 'react-redux'
import Navbar from 'src/common/Navbar'
import Games from './components/Games'
import api from 'src/utils/apiHOC'
import { autobind } from 'core-decorators'
import Jext from 'src/common/Jext'
import Jimage from 'src/common/Jimage'

@connect(
  state => ({
    profile: state.Main.profile,
  }),
)
@api({
  url: 'games/smart-match',
  method: 'POST',
  name: 'smartMatch',
})
@autobind
export default class Home extends React.Component {
  startNewGame(type) {
    const { data: { smartMatch } } = this.props

    switch (type) {
      case 'smart-matching':
        smartMatch()
          .then(({ game }) => {
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
          leftElement={
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
              <Jimage
                source={{ uri: profile.avatar }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  marginLeft: 10,
                }}
              />

            </View>
          }
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
            title='بازی با رقیب تصادفی'
            onPress={() => this.startNewGame('smart-matching')}
            disabled={smartMatchLoading}
          />
          <Button
            title='جستجوی دوستان'
            onPress={() => ''}
            disabled
          />
        </View>

      </View>
    )
  }
}