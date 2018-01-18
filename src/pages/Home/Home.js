import React from 'react';
import {
  View,
  Text,
  Button,
} from 'react-native';
import { navigate } from 'src/helpers/navigation.helper'

export default class Home extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'  }}>
        <Button
          title='New Game'
          onPress={() => navigate({
            navigator: this.props.navigator,
            screen: 'Game',
            method: 'push',
            options: {
              navigatorStyle: {
                drawUnderTabBar: true,
                navBarHidden: true,
                tabBarHidden: true,
              }
            }
          })}
        />
      </View>
    )
  }
}