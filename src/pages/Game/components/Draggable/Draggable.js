import React from 'react'
import {
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native"
import _ from 'lodash'
import { autobind } from 'core-decorators'
import * as Animatable from 'react-native-animatable'

const { width, height } = Dimensions.get('window')

@autobind
export default class Draggable extends React.Component {
  constructor() {
    super()
    this.state = {
      dropAreaValues: null,
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1),
      left: 0,
      bottom: 0,
      position: undefined,
    }
  }

  componentWillMount() {
    // Add a listener for the delta value change
    this._val = { x: 0, y: 0 }
    this.state.pan.addListener((value) => this._val = value)
    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderMove: this.responderMoveHandler,
      onPanResponderGrant: this.responderGrantHandler,
      onPanResponderRelease: this.responderReleaseHandler
      // adjusting delta value
    })

    this.state.pan.setValue({ x: 0, y: 0 })
  }

  shouldComponentUpdate(np, ns) {
    return !_.isEqual(ns, this.state)
  }

  responderGrantHandler = (e, gesture) => {
    console.log('Draggable.responderGrantHandler')
    Animated.timing(this.state.scale, {
      toValue: 2,
      duration: 0,
    }).start()
  }

  responderMoveHandler = (e, gesture) => {
    console.log('Draggable.responderMoveHandler')
    Animated.timing(this.state.pan, {
      toValue: {
        x: gesture.dx,
        y: gesture.dy,
      },
      duration: 0,
    })
      .start()
  }

  responderReleaseHandler = async (e, gesture) => {
    console.log('Draggable.responderReleaseHandler')
    const { checkDropZone } = this.props

    const dropLoc = await checkDropZone(e.nativeEvent, gesture)

    if (dropLoc && !dropLoc.letter) {
      // const matchedTile = checkDropZone(gesture)

      // wrapper.transitionTo({ width: matchedTile.width, height: matchedTile.height }, 1000)

      Animated.spring(this.state.scale, {
        toValue: 0.7,
        duration: 10,
      }).start()
    } else {
      // wrapper.transitionTo({ opacity: 0 }, 1000)

      Animated.spring(this.state.pan, {
        toValue: { x: 0, y: 0 },
        friction: 5
      }).start()
      Animated.spring(this.state.scale, {
        toValue: 1,
        duration: 20,
      }).start()
    }
  }

  move({ x, y }) {
    console.log('Draggable.move')
    Animated.timing(this.state.scale, {
      toValue: 2,
      duration: 0,
    }).start()
    Animated.timing(this.state.pan, {
      toValue: {
        x,
        y,
      },
      duration: 0,
    })
      .start()
  }

  place({ x, y }) {
    console.log('Draggable.place')
    const { style: { width } } = this.props

    const self = this
    return new Promise((res) => {
      Animated.timing(this.state.scale, {
        toValue: 2,
        duration: 0,
      }).start()
      self.setState({
        position: 'absolute',
        left: (x - (0.6 * width)),
        bottom: ((height - y) - (0.12 * height)),
      }, res)
    })
  }

  render() {
    const { left, bottom, position } = this.state
    const { style } = this.props

    const panStyle = {
      transform: [
        ...this.state.pan.getTranslateTransform(),
        { scale: this.state.scale }
      ],
    }
    return (
      <Animatable.View
        ref="wrapper"
        {...this.panResponder.panHandlers}
        style={[styles.circle, panStyle, style, {
          position,
          left,
          bottom,
        }]}
      >
        {this.props.children}
      </Animatable.View>
    )
  }
}

let styles = StyleSheet.create({
  circle: {
    backgroundColor: '#FFC107',
    borderRadius: 10,
    marginHorizontal: 5,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})