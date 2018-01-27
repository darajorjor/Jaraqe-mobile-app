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
import Icon from 'react-native-vector-icons/Ionicons'

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
                width: 40,
                height: 40,
                borderRadius: 20
              }}
            />
          </TouchableOpacity>
          <View style={{ marginLeft: 10, alignItems: 'flex-start' }}>
            <Jext style={{ fontSize: 18, fontWeight: 'bold' }}>{ player.score }</Jext>
            <Jext style={{ fontSize: 8 }}>{player.user.username || player.user.fullName}</Jext>
          </View>
        </View>
        <View style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
          <View style={{ marginRight: 10, alignItems: 'flex-end' }}>
            <Jext style={{ fontSize: 18, fontWeight: 'bold' }}>{ player2.score }</Jext>
            <Jext style={{ fontSize: 8 }}>{player2.user.username || player2.user.fullName}</Jext>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => this.openProfileModal(player2.user)}>
            <Image
              source={{ uri: player2.user.avatar }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20
              }}
            />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigate({
            navigator: this.props.navigator,
            method: 'pop'
          })}
          style={{
            position: 'absolute',
            left: 5,
            padding: 5
          }}
        >
          <Icon
            name="ios-arrow-back"
            size={25}
          />
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => {}}
          style={{
            position: 'absolute',
            right: 3,
            padding: 5
          }}
          disabled
        >
          <Icon
            name="ios-text"
            size={25}
            color='#ddd'
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    height: 70,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    zIndex: 999,
    elevation: 2,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 35,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
})