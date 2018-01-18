import React from 'react';
import {
  View,
  Text,
  Button,
} from 'react-native';
import { navigate } from 'src/utils/helpers/navigation.helper'
import api from 'src/utils/apiHOC'

/*@api({
  url: 'users/login-instagram',
  method: 'GET',
  name: 'login',
  options: {
    instantCall: false
  }
})*/
export default class Login extends React.Component {
  handleInstagramLogin() {
    return navigate({
      method: 'showModal',
      screen: 'InstagramLogin'
    })
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff'  }}>
        <Button
          title='ورود با اینستاگرام'
          onPress={this.handleInstagramLogin}
        />
      </View>
    )
  }
}