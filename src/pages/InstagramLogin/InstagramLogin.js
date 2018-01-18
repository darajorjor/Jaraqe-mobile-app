import React from 'react';
import {
  View,
  WebView,
} from 'react-native';
import { startApp } from 'src/navigator'
import { connect } from 'react-redux'
import { setProfile, setSession } from 'src/redux/Main.reducer'
import { autobind } from 'core-decorators'

@connect(
  null,
  { setProfile, setSession }
)
@autobind
export default class InstagramLogin extends React.Component {
  onMessage({ nativeEvent: { data } }) {
    const { setProfile, setSession } = this.props

    try {
      const { session, user } = JSON.parse(data)

      setProfile(user)
      setSession(session)
      startApp()
    } catch (e) {
      console.error('mamad')
    }
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <WebView
          startInLoadingState
          source={{ uri: `http://192.168.1.110:3000/v1/users/login-instagram` }}
          bounces={false}
          onMessage={this.onMessage}
        />
      </View>
    )
  }
}