import React from 'react'
import {
  View,
  Button,
  AsyncStorage,
  TextInput,
} from 'react-native'
import { autobind } from 'core-decorators'
import api from 'src/utils/ApiHOC'
import { connect } from 'react-redux'
import { setProfileField } from 'src/redux/Main.reducer'
import t from 'src/utils/translate'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import { startApp } from 'src/navigator'
import Jext from 'src/common/Jext'

@api((props) => ({
  url: `users/self`,
  method: 'PUT',
  name: 'updateUser',
}))
@connect(
  state => ({
    profile: state.Main.profile,
  }),
  { setProfileField },
)
@autobind
export default class LoginExtraInfo extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      genderIndex: 0,
      referrer: null,
    }
  }

  handleIndexChange(index) {
    this.setState({
      ...this.state,
      genderIndex: index,
    })
  }

  submit() {
    const { data: { updateUser } } = this.props
    const { genderIndex, referrer } = this.state

    updateUser({
      body: {
        gender: genderIndex === 0 ? 'MALE' : 'FEMALE',
        referrer,
      }
    })
      .then(() => {
        AsyncStorage.removeItem('@Jaraqe:registration_state')
        startApp()
      })
      .catch(() => alert('خطایی رخ داد'))
  }

  render() {
    const { profile } = this.props

    return (
      <View style={{ flex: 1, paddingTop: 32, backgroundColor: '#fff' }}>
        <Jext style={{ fontSize: 18, paddingBottom: 16 }}>لطفا اطلاعات را کامل کنید</Jext>
        {
          !profile.isRegistered &&
          <View>
            <Jext>کد دعوت</Jext>
            <TextInput
              ref="textInput"
              value={this.state.referrer}
              onChangeText={referrer => this.setState({ referrer })}
              // style={styles.textInput}
              underlineColorAndroid='transparent'
              style={{
                fontSize: 18,
                textAlign: 'right',
                padding: 10,
                marginHorizontal: 16,
                borderBottomWidth: 1,
                borderBottomColor: '#eee',
              }}
            />
          </View>
        }

        <Jext>جنسیت</Jext>
        <SegmentedControlTab
          values={[t('مرد'), t('زن')]}
          selectedIndex={this.state.genderIndex}
          onTabPress={this.handleIndexChange}
          tabsContainerStyle={{
            marginHorizontal: 16,
            marginBottom: 32,
          }}
        />
        <Button
          title={t('ثبت')}
          onPress={this.submit}
        />
      </View>
    )
  }
}