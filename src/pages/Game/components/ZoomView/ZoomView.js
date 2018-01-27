import React, { Component } from 'react'
import {
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native'
import _ from 'lodash'
import { createResponder } from 'react-native-gesture-responder'

const { width, height } = Dimensions.get('window')

export default class ZoomView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scale: 1,
      scaleAnimation: new Animated.Value(1),
      // lastScale: 1,
      offsetX: 0,
      offsetY: 0,
      lastX: 0,
      lastY: 0
    }
    this.distant = 150
  }

  componentWillMount() {
    this.gestureHandlers = createResponder({
      onStartShouldSetPanResponderCapture: this._handleStartShouldSetPanResponderCapture,
      onStartShouldSetResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetResponder: this._handleMoveShouldSetPanResponder,
      onResponderGrant: this._handlePanResponderGrant,
      onResponderMove: this._handlePanResponderMove,
      onResponderRelease: this._handlePanResponderEnd,
      onResponderTerminationRequest: evt => true,
      onShouldBlockNativeResponder: evt => false
    })
  }

  _handleStartShouldSetPanResponderCapture = (e, gestureState) => {
    return false
  }

  _handleStartShouldSetPanResponder = (e, gestureState) => {

    return true
  }

  _handleMoveShouldSetPanResponder = (e, gestureState) => {
    return this.props.scalable && gestureState.dx > 2 || gestureState.dy > 2 || gestureState.numberActiveTouches === 2
  }

  _handlePanResponderGrant = ({ nativeEvent }, gestureState) => {
    console.log('ZoomView._handlePanResponderGrant')
    const { checkGrabZone, onWordSearch } = this.props

    const item = checkGrabZone(nativeEvent, { moveX: nativeEvent.pageX, moveY: nativeEvent.pageY })

    if (item && item.letter && item.letter.usedInWords) {
      this.longPressTimeout = setTimeout(() => {
        onWordSearch({
          from: { x: nativeEvent.pageX, y: nativeEvent.pageY },
          words: item.letter.usedInWords,
        })
      }, 200)
    } else if (item && item.isActive) {
      this.draggingItem = item
      this.draggingItem.handle.activate()
      this.props.setDragStart({
        item: this.draggingItem,
        x: nativeEvent.pageX,
        y: nativeEvent.pageY,
      })
    } else if (gestureState.numberActiveTouches === 2) {
      let dx = Math.abs(nativeEvent.touches[0].pageX - nativeEvent.touches[1].pageX)
      let dy = Math.abs(nativeEvent.touches[0].pageY - nativeEvent.touches[1].pageY)
      let distant = Math.sqrt(dx * dx + dy * dy)
      this.distant = distant
    }
  }

  _handlePanResponderEnd = ({ nativeEvent }, gestureState) => {
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout)
    }

    if (gestureState.doubleTapUp) {
      if (this.state.scale === 2) {
        this.setState({
          scale: 1,
          offsetX: 0,
          offsetY: 0,
        })
        Animated.spring(this.state.scaleAnimation, { toValue: 1, friction: 20 }).start(() => {
          this.setState({
            scale: 1,
            offsetX: 0,
            offsetY: 0,
          })
        })
      } else {
        Animated.spring(this.state.scaleAnimation, { toValue: 2, friction: 20 }).start(() => {
          this.setState({ scale: 2 })
        })
      }
    }

    console.log('ZoomView._handlePanResponderEnd')
    if (this.draggingItem) {
      if (this.draggingItem.moved) {
        this.props.onDrop({
          item: this.draggingItem,
          gestureState,
          nativeEvent
        })
      } else {
        this.props.onDrop({
          item: this.draggingItem,
          gestureState: {
            moveX: gestureState.x0,
            moveY: gestureState.y0,
          },
          nativeEvent
        })
      }
      this.draggingItem = null
    } else {
      this.setState({
        lastX: this.state.offsetX,
        lastY: this.state.offsetY,
        // lastScale: this.state.scale
      })
    }
  }

  _handlePanResponderMove = ({ nativeEvent }, gestureState) => {
    console.log('ZoomView._handlePanResponderMove')
    const { scale } = this.state
    if (this.longPressTimeout) {
      clearTimeout(this.longPressTimeout)
    }

    if (this.draggingItem) {
      this.draggingItem.moved = true
      this.props.onDrag({
        item: this.draggingItem,
        gesture: gestureState,
        nativeEvent,
      })
      this.setState({
        draggableX: gestureState.moveX,
        draggableY: gestureState.moveY,
      })
    } else if (gestureState.numberActiveTouches === 2 || gestureState.doubleTapUp) { /* zoom*/
      // let scale = distant / this.distant * this.state.lastScale
      if (gestureState.pinch && (Math.abs(gestureState.pinch - gestureState.previousPinch)) > 5) {
        if (gestureState.pinch - gestureState.previousPinch > 0) {
          Animated.spring(this.state.scaleAnimation, { toValue: 2, friction: 20 }).start(() => {
            this.setState({ scale: 2 })
          })
        } else {
          Animated.spring(this.state.scaleAnimation, { toValue: 1, friction: 20 }).start(() => {
            this.setState({
              scale: 1,
              offsetX: 0,
              offsetY: 0,
            })
          })
        }
      }
    } else if (gestureState.numberActiveTouches === 1) {
      if (scale === 2) {
        const maxOffsetX = width / 3.8
        const maxOffsetY = height / 7
        let offsetX = this.state.lastX + gestureState.dx / this.state.scale
        if (Math.abs(offsetX) >= maxOffsetX) {
          if (offsetX > 0) {
            offsetX = maxOffsetX
          } else {
            offsetX = -maxOffsetX
          }
        }
        let offsetY = this.state.lastY + gestureState.dy / this.state.scale
        if (Math.abs(offsetY) >= maxOffsetY) {
          if (offsetY > 0) {
            offsetY = maxOffsetY
          } else {
            offsetY = -(maxOffsetY)
          }
        }
        this.setState({ offsetX, offsetY })
      }
    }
  }

  getOffsets() {
    return {
      scale: this.state.scale,
      offsetX: this.state.offsetX,
      offsetY: this.state.offsetY,
    }
  }

  // Called from outside
  zoom({ offsetX, offsetY }) {
    const maxOffsetX = width / 3.8
    const maxOffsetY = height / 7

    if (Math.abs(offsetX) >= maxOffsetX) {
      if (offsetX > 0) {
        offsetX = maxOffsetX
      } else {
        offsetX = -maxOffsetX
      }
    }
    if (Math.abs(offsetY) >= maxOffsetY) {
      if (offsetY > 0) {
        offsetY = maxOffsetY
      } else {
        offsetY = -(maxOffsetY)
      }
    }

    console.log('ZoomView.zoom')
    if (this.state.scale !== 2) {
      Animated.spring(this.state.scaleAnimation, { toValue: 2, friction: 20 }).start(() => {
        if (offsetX && offsetY) {
          this.setState({ scale: 2 })
          // this.setState({ scale: 2, offsetX, offsetY })
        } else {
          this.setState({ scale: 2 })
        }
      })
    } else {
      // this.setState({ offsetX, offsetY })
    }
  }

  shouldComponentUpdate(np, ns) {
    return !_.isEqual(ns, this.state)
  }

  render() {
    this.props.onViewChange({
      scaleAnimation: this.state.scaleAnimation,
      offsetX: this.state.offsetX,
      offsetY: this.state.offsetY,
      draggableX: this.state.draggableX,
      draggableY: this.state.draggableY,
    })

    return (
      <Animated.View
        {...this.props}
        {...this.gestureHandlers}
        style={[styles.container, this.props.style, {
          transform: [
            { scale: this.state.scaleAnimation },
            { translateX: this.state.offsetX },
            { translateY: this.state.offsetY }
          ]
        }]}>
        {this.props.children}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
