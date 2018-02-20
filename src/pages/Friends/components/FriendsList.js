import React from 'react';
import {
  View,
} from 'react-native';
import MenuItem from 'src/common/MenuItem'
import Avatar from 'src/common/Avatar'
import Jext from 'src/common/Jext'
import { navigate } from 'src/utils/helpers/navigation.helper'
import { connect } from 'react-redux'

@connect(
  state => ({
    profile: state.Main.profile,
  })
)
export default class FriendsList extends React.Component {
  render() {
    const { profile } = this.props

    return (
      <View>
        <Jext style={{ textAlign: 'right', fontSize: 16 }}>دوستان</Jext>
        {
          profile && profile.friends.map((user) => (
            <MenuItem
              title={user.fullName}
              rightIcon={<Avatar
                source={{ uri: user.avatar }}
                online={user.isOnline}
                style={{ width: 25, height: 25, borderRadius: 12.5 }}
              />}
              onPress={() => navigate({
                screen: 'UserProfile',
                method: 'showModal',
                options: {
                  passProps: {
                    profile: user,
                  }
                }
              })}
            />
          ))
        }
      </View>
    )
  }
}