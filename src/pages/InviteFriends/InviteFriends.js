import React from 'react'
import {
  View,
  Button,
  Share,
  TouchableOpacity,
  Clipboard,
} from 'react-native'
import { connect } from 'react-redux'
import { setProfile, setSession } from 'src/redux/Main.reducer'
import { autobind } from 'core-decorators'
import Navbar from 'src/common/Navbar'
import Jext from 'src/common/Jext'

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

  handleShare() {
    const { profile } = this.props

    return Share.share({
      message: `نام کاربریم تو جرقه ${profile.username}ئه، اومدی یه صفحه میاد اونجا واردش کن دوتامون کبریت بگیریم`,
      url: `http://jaraqe.com/invite/${profile.username}`,
      title: 'پاشو بیا باهم جرقه بزنیم!',
    })
  }

  render() {
    const { profile } = this.props

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Navbar
          title="دعوت دوستان"
          backable
        />

        <View style={{ flex: 1, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
          <TouchableOpacity
            style={{ alignItems: 'center', paddingVertical: 16 }}
            onPress={() => {
              Clipboard.setString(profile.username)
              toast({
                title: 'در کلیپرد کپی شد',
                status: 'info',
              })
            }}
          >
            <Jext f={30} style={{ borderWidth: 1, borderColor: '#eee', borderRadius: 15, padding: 10 }}>{ profile.username }</Jext>
          </TouchableOpacity>
        </View>

        <Button
          title='به اشتراک گذاری'
          onPress={this.handleShare}
        />
      </View>
    )
  }
}