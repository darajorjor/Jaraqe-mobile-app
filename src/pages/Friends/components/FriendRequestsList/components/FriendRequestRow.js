import React from 'react'
import {
  Button,
  View,
} from 'react-native'
import MenuItem from 'src/common/MenuItem'
import Jimage from 'src/common/Jimage'
import api from 'src/utils/apiHOC'
import { autobind } from 'core-decorators'
import { connect } from 'react-redux'
import { setProfile } from 'src/redux/Main.reducer'

@api((props) => ({
  url: `users/friend-requests/${props.friendRequestId}`,
  method: 'POST',
  name: 'respondToFriendRequest',
}))
@connect(
  state => ({
    profile: state.Main.profile,
  }),
  { setProfile }
)
@autobind
export default class FriendRequestRow extends React.Component {
  handleSubmit(accept) {
    const { data: { respondToFriendRequest }, friendRequestId, setProfile, profile } = this.props

    return respondToFriendRequest({
      body: {
        accept
      }
    })
      .then(({ data }) => {
        profile.friendRequests = profile.friendRequests.filter(fr => fr.id !== friendRequestId)
        setProfile(profile)
      })
  }

  render() {
    const { user } = this.props

    return (
      <MenuItem
        title={user.fullName}
        rightIcon={<Jimage
          source={{ url: user.avatar }}
          style={{ width: 25, height: 25, borderRadius: 12.5 }}
        />}
        leftIcon={<View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Button
            title='رد'
            color='red'
            onPress={() => this.handleSubmit(false)}
          />
          <Button
            title='قبول'
            onPress={() => this.handleSubmit(true)}
          />
        </View>}
      />
    )
  }
}