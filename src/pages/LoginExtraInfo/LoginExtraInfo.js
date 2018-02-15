import React from 'react'
import {
  View,
  Button,
} from 'react-native'
import { autobind } from 'core-decorators'
import api from 'src/utils/ApiHOC'
import { connect } from 'react-redux'
import { setProfileField } from 'src/redux/Main.reducer'
import t from 'src/utils/translate'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import { startApp } from 'src/navigator'

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
    const { genderIndex } = this.state

    updateUser({
      body: {
        gender: genderIndex === 0 ? 'MALE' : 'FEMALE'
      }
    })
      .then(startApp)
      .catch(() => alert('خطایی رخ داد'))
  }

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 70, backgroundColor: '#fff' }}>
        <SegmentedControlTab
          values={[t('مرد'), t('زن')]}
          selectedIndex={this.state.genderIndex}
          onTabPress={this.handleIndexChange}
          tabsContainerStyle={{
            marginHorizontal: 16,
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