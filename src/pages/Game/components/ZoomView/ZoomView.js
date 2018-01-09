import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated, Text,
} from 'react-native';
import _ from 'lodash';
import { createResponder } from 'react-native-gesture-responder';

const { width, height } = Dimensions.get('window');

export default class ZoomView extends Component {

  static propTypes = {
    ...View.propTypes,
    scalable: PropTypes.bool
  };

  static defaultProps = {
    scalable: true
  };

  constructor(props) {
    super(props);
    this.state = {
      scale: 1,
      scaleAnimation: new Animated.Value(1),
      // lastScale: 1,
      offsetX: 0,
      offsetY: 0,
      lastX: 0,
      lastY: 0
    };
    this.distant = 150;
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
    });
  }

  _handleStartShouldSetPanResponderCapture = (e, gestureState) => {

    return false;
  }

  _handleStartShouldSetPanResponder = (e, gestureState) => {

    return true
  }

  _handleMoveShouldSetPanResponder = (e, gestureState) => {
    return this.props.scalable && gestureState.dx > 2 || gestureState.dy > 2 || gestureState.numberActiveTouches === 2;
  }

  _handlePanResponderGrant = ({ nativeEvent }, gestureState) => {
    const { checkGrabZone } = this.props;

    const item = checkGrabZone({ moveX: nativeEvent.pageX, moveY: nativeEvent.pageY })

    if (item) {
      this.draggingItem = item
      this.props.setDragStart({
        item: this.draggingItem,
        x: 100,
        y: 100
      });
    } else if (gestureState.numberActiveTouches === 2) {
      let dx = Math.abs(nativeEvent.touches[ 0 ].pageX - nativeEvent.touches[ 1 ].pageX);
      let dy = Math.abs(nativeEvent.touches[ 0 ].pageY - nativeEvent.touches[ 1 ].pageY);
      let distant = Math.sqrt(dx * dx + dy * dy);
      this.distant = distant;
    }
  }

  _handlePanResponderEnd = (e, gestureState) => {
    this.setState({
      lastX: this.state.offsetX,
      lastY: this.state.offsetY,
      // lastScale: this.state.scale
    });
  }

  _handlePanResponderMove = ({ nativeEvent }, gestureState) => {
    const { scale } = this.state;

    if (this.draggingItem) {
      console.log(nativeEvent)
      console.log(gestureState)
      this.props.onDrag({
        item: this.draggingItem,
        x: gestureState.dx,
        y: gestureState.dy
      });
      this.setState({
        draggableX: (gestureState.x0 + gestureState.dx),
        draggableY: (gestureState.y0 + gestureState.dy),
      })
    } else if (gestureState.numberActiveTouches === 2) { /* zoom*/
      // let scale = distant / this.distant * this.state.lastScale;
      if (gestureState.pinch && (Math.abs(gestureState.pinch - gestureState.previousPinch)) > 5) {
        if (gestureState.pinch - gestureState.previousPinch > 0) {
          Animated.spring(this.state.scaleAnimation, { toValue: 2, friction: 20 }).start(() => {
            this.setState({ scale: 2 });
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
        const maxOffsetX = width / 3.8;
        const maxOffsetY = height / 15;
        let offsetX = this.state.lastX + gestureState.dx / this.state.scale;
        if (Math.abs(offsetX) >= maxOffsetX) {
          if (offsetX > 0) {
            offsetX = maxOffsetX;
          } else {
            offsetX = -maxOffsetX;
          }
        }
        let offsetY = this.state.lastY + gestureState.dy / this.state.scale;
        if (Math.abs(offsetY) >= maxOffsetY) {
          if (offsetY > 0) {
            offsetY = maxOffsetY;
          } else {
            offsetY = -(maxOffsetY);
          }
        }
        this.setState({ offsetX, offsetY });
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
    Animated.spring(this.state.scaleAnimation, { toValue: 2, friction: 20 }).start(() => {
      this.setState({ scale: 2 });
    })

    if (offsetX && offsetY) {
      this.setState({ offsetX, offsetY });
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
        style={[ styles.container, this.props.style, {
          transform: [
            { scale: this.state.scaleAnimation },
            { translateX: this.state.offsetX },
            { translateY: this.state.offsetY }
          ]
        } ]}>
        {this.props.children}
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
