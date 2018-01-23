import React from 'react'
import {
  View,
  StyleSheet,
  Image,
} from "react-native"
import { autobind } from 'core-decorators'
import { navigate } from 'src/utils/helpers/navigation.helper'
import Jext from 'src/common/Jext'

@autobind
export default class GameNav extends React.PureComponent {
  openProfileModal(profile) {
    return navigate({
      screen: 'UserProfile',
      method: 'showModal',
      options: {
        passProps: {
          profile,
        }
      }
    })
  }

  render() {
    const { player, player2 } = this.props

    return (
      <View style={styles.wrapper}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{ uri: player.user.avatar }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25
            }}
          />
          <View style={{ alignItems: 'center' }}>
            <Jext style={{ fontSize: 12 }}>{player.user.fullName}</Jext>
            <Jext onPress={() => this.openProfileModal(player.user)} style={{ color: '#007aff' }}>مشاهده پروفایل</Jext>
          </View>
        </View>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
          borderLeftWidth: 1,
          borderLeftColor: '#eee',
        }}>
          <View style={{ alignItems: 'center' }}>
            <Jext style={{ fontSize: 12 }}>{player2.user.fullName}</Jext>
            <Jext onPress={() => this.openProfileModal(player2.user)} style={{ color: '#007aff' }}>مشاهده پروفایل</Jext>
          </View>
          <Image
            source={{ uri: player2.user.avatar }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25
            }}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    height: 80,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10
  },
})