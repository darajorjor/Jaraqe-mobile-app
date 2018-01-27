import React from 'react'
import {
  View,
  StyleSheet,
} from "react-native"
import { autobind } from 'core-decorators'
import Jext from 'src/common/Jext'

function getBackgroundColor(letter) {
  switch (letter) {
    case '+':
      return '#9575CD'
    case 'TL':
      return '#4CAF50'
    case 'DL':
      return '#4DB6AC'
    case 'TW':
      return '#FF9800'
    case 'DW':
      return '#FF5722'
    default:
      return '#E0E0E0'
  }
}

@autobind
export default class Tile extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      active: false
    }
  }

  activate(letter) {
    console.log('Tile.activate')

    this.setState({ active: letter })
  }

  isActive() {
    return this.state.active
  }

  getBorderRadius({ left, right, top, bottom }) {
    let borderTopLeftRadius = 4,
      borderTopRightRadius = 4,
      borderBottomRightRadius = 4,
      borderBottomLeftRadius = 4
    if (left) {
      borderTopLeftRadius = 0
      borderBottomLeftRadius = 0
    }
    if (right) {
      borderTopRightRadius = 0
      borderBottomRightRadius = 0
    }
    if (bottom) {
      borderBottomRightRadius = 0
      borderBottomLeftRadius = 0
    }
    if (top) {
      borderTopLeftRadius = 0
      borderTopRightRadius = 0
    }

    return {
      borderTopLeftRadius,
      borderTopRightRadius,
      borderBottomRightRadius,
      borderBottomLeftRadius,
    }
  }

  render() {
    const { style, onRender, placeHolder, onGrab, letter } = this.props
    const { active } = this.state

    return (
      <View
        ref='root'
        style={[
          styles.wrapper,
          {
            backgroundColor: active ? '#FFC107' : getBackgroundColor(placeHolder),
          },
          style,
          letter ?
            {
              backgroundColor: '#FFC107',
              margin: 0,
              padding: 2,
              ...this.getBorderRadius(placeHolder.options),
              transform: [
                {
                  scale: 1.01,
                }
              ]
            }
            : null
        ]}
        onLayout={() => onRender(this.refs.root)}
      >
        {
          letter &&
          <Jext style={{ position: 'absolute', right: 1, top: 1, fontSize: 7 }} >{placeHolder.point}</Jext>
        }
        {
          active &&
          <Jext style={{ position: 'absolute', right: 1, top: 1, fontSize: 6 }} >{active.point}</Jext>
        }
        <Jext>{ !!active ? active.value : letter ? placeHolder.value : placeHolder }</Jext>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    aspectRatio: 1,
    // width: 25,
    // height: 25,
    // height: wrapper === 'grown' ? (((width * 2) / tileMap.length) - margin) - 2.1 : ((width / tileMap.length) - margin) - 2.1,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  }
})