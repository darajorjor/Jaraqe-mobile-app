import React from 'react'
import {
  View,
} from 'react-native'
import { connect } from 'react-redux'
import { setProfile, setSession } from 'src/redux/Main.reducer'
import { autobind } from 'core-decorators'
import Navbar from 'src/common/Navbar'
import { GiftedChat } from 'react-native-gifted-chat'

@connect(
  state => ({
    profile: state.Main.profile,
  }),
  { setProfile, setSession }
)
@autobind
export default class InviteFriends extends React.Component {
  static navigatorStyle = {
    navBarHidden: true,
  }

  state = {
    messages: [],
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        },
      ],
    })
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }))
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Navbar
          title="گپ"
          navigator={this.props.navigator}
          backable
        />

        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
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
            _id: 1,
          }}
        />
      </View>
    )
  }
}