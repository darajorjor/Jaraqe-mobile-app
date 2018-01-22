import React from 'react'
import {
  View,
  StyleSheet,
  Button,
} from "react-native"
import { autobind } from 'core-decorators'

@autobind
export default class GameBar extends React.PureComponent {
  render() {
    const { onSubmit, submitDisabled } = this.props

    return (
      <View style={styles.wrapper}>
        <Button
          title='💥جرقه'
          onPress={onSubmit}
          disabled={submitDisabled}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    height: 60,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
})