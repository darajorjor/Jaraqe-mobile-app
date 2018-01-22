import React from 'react';
import {
  View,
} from 'react-native';
import { connect } from 'react-redux'
import Jext from 'src/common/Jext'
import FriendRequestRow from './components/FriendRequestRow'

@connect(
  state => ({
    profile: state.Main.profile,
  })
)
export default class FriendsList extends React.Component {
  render() {
    const { profile } = this.props

    return (
      <View style={{ flex: 1 }}>
        <Jext style={{ textAlign: 'right', fontSize: 16 }}>درخواست های دوستی</Jext>
        {
          profile && profile.friendRequests.map(({ id, user }) => (
            <FriendRequestRow
              key={id}
              friendRequestId={id}
              user={user}
            />
          ))
        }
      </View>
    )
  }
}