import React from 'react'
import {
  View,
  Button,
  Linking,
  Platform,
} from 'react-native'
import { navigate } from 'src/utils/helpers/navigation.helper'
import config from 'src/config'
import { startApp } from 'src/navigator'
import { connect } from 'react-redux'
import { setProfile, setSession } from 'src/redux/Main.reducer'
import { autobind } from 'core-decorators'
import SafariView from 'react-native-safari-view'
import Icon from 'react-native-vector-icons/Ionicons'

@connect(
  null,
  { setProfile, setSession }
)
@autobind
export default class Login extends React.Component {
  componentDidMount() {
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
      if (Platform.OS === 'ios') {
        SafariView.dismiss();
        setTimeout(() => {
          startApp()
        }, 500)
      } else {
        startApp()
      }
    } catch (e) {
      console.error(e)
    }
  }

  handleLogin(type) {
    const url = `${config.api}/users/login-${type}`
    console.log(url)
    if (Platform.OS === 'ios') {
      SafariView.isAvailable()
        .then(SafariView.show({
          // url: 'https://github.com/naoufal'

          url,
          fromBottom: true,
        }))
        .catch(error => {
          console.error(error)
          // Fallback WebView code for iOS 8 and earlier
        });

    } else {
      Linking.openURL(url);
    }
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
        <Button
          title='ورود با اینستاگرام'
          onPress={() => this.handleLogin('instagram')}
        />
        <Icon.Button
          name="ios-key"
          backgroundColor="#DD4B39"
          onPress={() => this.handleLogin('google')}
        >
          ورود با گوگل
        </Icon.Button>
      </View>
    )
  }
}