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
    const { onSubmit, submitDisabled, onOptions } = this.props

    return (
      <View style={styles.wrapper}>
        <View style={styles.section}>
          <Button
            title='☰'
            onPress={onOptions}
            // disabled={submitDisabled}
          />
        </View>
        <View style={styles.section}>
          <Button
            title='💥جرقه'
            onPress={onSubmit}
            disabled={submitDisabled}
          />
        </View>
        <View style={styles.section}></View>
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
    flexDirection: 'row',
    zIndex: 999,
  },
  section: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})