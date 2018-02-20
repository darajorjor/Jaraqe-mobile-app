import React from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native'
import Navbar from 'src/common/Navbar'
import FriendsList from './components/FriendsList'
import FriendRequestsList from './components/FriendRequestsList'
import UserSearch from './components/UserSearch'
import { connect } from 'react-redux'
import Jext from 'src/common/Jext'
import { navigate } from 'src/utils/helpers/navigation.helper'

const { width } = Dimensions.get('window')

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
      <View style={{ flex: 1, }}>
        <Navbar
          title="دوستان"
          leftElement={profile && <Jext>{ profile.coins } کبریت</Jext>}
        />
        <UserSearch
          navigator={this.props.navigator}
        />

        <View style={{ zIndex: -1, marginTop: 80 }}>
          {
            profile.friendRequests.length > 0 &&
            <FriendRequestsList />
          }
          <TouchableOpacity
            style={styles.inviteFriends}
            onPress={() => navigate({
              method: 'showModal',
              screen: 'InviteFriends',
            })}
          >
            <Jext f={18} c='#fff'>دوستاتونو دعوت کنید و کبریت ببرید</Jext>
          </TouchableOpacity>
          {
            profile.friends.length > 0 &&
            <FriendsList />
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  inviteFriends: {
    width,
    height: 120,
    backgroundColor: '#3193fe',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
