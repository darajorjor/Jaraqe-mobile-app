import React from 'react'
import {
  View,
  Platform,
  Linking,
} from 'react-native'
import { startApp } from 'src/navigator'
import { connect } from 'react-redux'
import { setProfile, setSession } from 'src/redux/Main.reducer'
import { autobind } from 'core-decorators'
import config from 'src/config'

@connect(
  null,
  { setProfile, setSession }
)
@autobind
export default class OAuthLogin extends React.Component {
  componentDidMount() {
    const { type } = this.props

    Linking.openURL(`${config.api}/users/login-${type}`)
    Linking.addEventListener('url', this.handleOpenURL);
    // Launched from an external URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleOpenURL({ url });
      }
    });
  }

  componentWillUnmount() {
    // Remove event listener
    Linking.removeEventListener('url', this.handleOpenURL);
  };

  handleOpenURL = ({ url }) => {
    // Extract stringified user string out of the URL
    const [, user_string] = url.match(/user=([^#]+)/);
    const { setProfile, setSession } = this.props

    try {
      const { session, user } = JSON.parse(decodeURI(user_string))

      setProfile(user)
      setSession(session)
      startApp()
    } catch (e) {
      console.error(e)
    }

    if (Platform.OS === 'ios') {
      SafariView.dismiss();
    }
  }

  render() {

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
{/*
        <WebView
          startInLoadingState
          source={{ uri: `${config.api}/users/login-${type}` }}
          bounces={false}
          onMessage={this.onMessage}
        />
*/}
      </View>
    )
  }
}