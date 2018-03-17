import React from 'react'
import {
  View,
} from 'react-native'
import { connect } from 'react-redux'
import { autobind } from 'core-decorators'
import Navbar from 'src/common/Navbar'
import { GiftedChat } from 'react-native-gifted-chat'
import api from 'src/utils/ApiHOC'
import { navigate } from 'src/utils/helpers/navigation.helper'
import { send, setInitialMessages, seeMessages } from './Chat.redux'

@api((props) => ({
  url: `games/${props.gameId}/chats`,
}), {
  method: 'GET',
  name: 'chats',
  options: {
    instantCall: false,
  },
})
@connect(
  state => ({
    profile: state.Main.profile,
    messages: state.Chat.messages,
  }),
  { send, setInitialMessages, seeMessages },
)
@autobind
export default class InviteFriends extends React.Component {
  static navigatorStyle = {
    navBarHidden: true,
  }

  onSend(messages = []) {
    const { gameId } = this.props
    this.props.send(messages, gameId)
  }

  componentWillMount() {
    const { setInitialMessages, data: { chatsRefetch } } = this.props

    chatsRefetch()
      .then(({ messages }) => setInitialMessages(messages))
  }

  componentDidMount() {
    const { seeMessages, gameId } = this.props

    seeMessages(gameId)
  }

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
    const { messages, profile } = this.props

    return (
      <View style={{ flex: 1 }}>
        <Navbar
          title="گپ"
          navigator={this.props.navigator}
          backable
        />

        <GiftedChat
          messages={messages}
          onSend={this.onSend}
          onPressAvatar={(a) => this.openProfileModal({ id: a._id })}
          // locale="fa_IR"
          // placeholder='سکوت هیچکیو به هیچجا نرسوند'
          // isAnimated
          // textInputProps={{
          //   style: {
          //     textAlign: 'right',
          //     padding: 10,
          //     width: width - 64,
          //   },
          // }}
          user={{
            _id: profile.id,
          }}
        />
      </View>
    )
  }
}