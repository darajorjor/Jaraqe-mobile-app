import React from 'react'
import {
  View,
} from 'react-native'
import Navbar from 'src/common/Navbar'
import FriendsList from './components/FriendsList'
import FriendRequestsList from './components/FriendRequestsList'
import UserSearch from './components/UserSearch'
import { connect } from 'react-redux'

@connect(
  state => ({
    profile: state.Main.profile,
  })
)
export default class Friends extends React.Component {
  componentDidUpdate(pp, ps) {
    if (this.props.profile) {
      this.props.navigator.setTabBadge({
        tabIndex: 1,
        badge: this.props.profile.friendRequests.length ? this.props.profile.friendRequests.length : null,
      })
    }
  }

  render() {
    const { profile } = this.props

    if (!profile) return null

    return (
      <View style={{ flex: 1 }}>
        <Navbar />
        <UserSearch />

        <View style={{ zIndex: -1 }}>
          {
            profile.friendRequests.length > 0 &&
            <FriendRequestsList />
          }
          {
            profile.friends.length > 0 &&
            <FriendsList />
          }
        </View>
      </View>
    )
  }
}