import React from 'react'
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
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
          <TouchableOpacity activeOpacity={0.7} onPress={() => this.openProfileModal(player.user)}>
            <Image
              source={{ uri: player.user.avatar }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25
              }}
            />
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Jext style={{ fontSize: 12 }}>{player.user.username || player.user.fullName}</Jext>
            <Jext style={{ fontSize: 12 }}>امتیاز:  {player.score}</Jext>
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
            <Jext style={{ fontSize: 12 }}>{player2.user.username || player2.user.fullName}</Jext>
            <Jext style={{ fontSize: 12 }}>امتیاز:  {player2.score}</Jext>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => this.openProfileModal(player2.user)}>
            <Image
              source={{ uri: player2.user.avatar }}
              style={{
                width: 50,
                height: 50,
                borderRadius: 25
              }}
            />
          </TouchableOpacity>
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
    padding: 10,
    zIndex: 99999999,
    elevation: 9999,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
})