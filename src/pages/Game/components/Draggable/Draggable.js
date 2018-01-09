import React from 'react';
import {
  StyleSheet,
  PanResponder,
  Animated,
  Dimensions,
} from "react-native";
import _ from 'lodash';
import { autobind } from 'core-decorators';
import * as Animatable from 'react-native-animatable';

const { width } = Dimensions.get('window');

@autobind
export default class Draggable extends React.Component {
  constructor() {
    super();
    this.state = {
      dropAreaValues: null,
      pan: new Animated.ValueXY(),
      scale: new Animated.Value(1),
    };
  }

  componentWillMount() {
    // Add a listener for the delta value change
    this._val = { x: 0, y: 0 }
    this.state.pan.addListener((value) => this._val = value);
    // Initialize PanResponder with move handling
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => true,
      onPanResponderMove: this.responderMoveHandler,
      onPanResponderGrant: this.responderGrantHandler,
      onPanResponderRelease: this.responderReleaseHandler
      // adjusting delta value
    });

    this.state.pan.setValue({ x: 0, y: 0 })
  }

  shouldComponentUpdate(np, ns) {
    return !_.isEqual(ns, this.state)
  }

  responderGrantHandler = (e, gesture) => {
    Animated.timing(this.state.scale, {
      toValue: 2,
      duration: 0,
    }).start();
  }

  responderMoveHandler = (e, gesture) => {
    Animated.timing(this.state.pan, {
      toValue: {
        x: gesture.dx,
        y: gesture.dy,
      },
      duration: 0,
    })
      .start();
  }

  responderReleaseHandler = (e, gesture) => {
    const { checkDropZone } = this.props;

    if (checkDropZone(gesture)) {
      // const matchedTile = checkDropZone(gesture);

      // wrapper.transitionTo({ width: matchedTile.width, height: matchedTile.height }, 1000);

      Animated.spring(this.state.scale, {
        toValue: 0.7,
        duration: 10,
      }).start();
    } else {
      // wrapper.transitionTo({ opacity: 0 }, 1000);

      Animated.spring(this.state.pan, {
        toValue: { x: 0, y: 0 },
        friction: 5
      }).start();
      Animated.spring(this.state.scale, {
        toValue: 1,
        duration: 20,
      }).start();
    }
  }

  move({ x, y }) {
    Animated.timing(this.state.scale, {
      toValue: 2,
      duration: 0,
    }).start();
    Animated.timing(this.state.pan, {
      toValue: {
        x,
        y,
      },
      duration: 0,
    })
      .start();
  }

  render() {
    const { style } = this.props;

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
        style={[styles.circle, panStyle, style]}
      >
        {this.props.children}
      </Animatable.View>
    );
  }
}

let styles = StyleSheet.create({
  circle: {
    backgroundColor: "skyblue",
    borderRadius: 10,
    width: (width / 7) - 10,
    marginHorizontal: 5,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});