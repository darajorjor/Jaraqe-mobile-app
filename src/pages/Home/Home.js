import React from 'react';
import {
  View,
  Text,
  Image,
  Button,
} from 'react-native';
import { navigate } from 'src/utils/helpers/navigation.helper'
import { connect } from 'react-redux'
import Navbar from 'src/common/Navbar'

@connect(
  state => ({
    profile: state.Main.profile,
  })
)
export default class Home extends React.Component {
  render() {
    const { profile } = this.props

    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Navbar
          leftElement={
            profile &&
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={{ url: profile.avatar }}
                style={{
                  width: 50,
                  borderRadius: 25,
                  aspectRatio: 1,
                  marginRight: 10,
                }}
              />
              <View style={{ alignItems: 'center' }}>
                <Text>{profile.full_name}</Text>
                <Text onPress={() => {}} style={{ color: '#007aff' }}>مشاهده پروفایل</Text>
              </View>
            </View>
          }
        />

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