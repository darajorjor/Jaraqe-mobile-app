import React from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  View,
} from "react-native"
import { autobind } from 'core-decorators'
import * as Animatable from 'react-native-animatable'
import Jext from 'src/common/Jext'
import MenuItem from 'src/common/MenuItem'
import Icon from 'react-native-vector-icons/Ionicons'

const { height, width } = Dimensions.get('window')

const TRANSITION_STATES = {
  container: {
    grown: {
      // transform: [{ scale: 1 }],
      transform: [{ translateY: 0 }],
      // left: 0,
      // right: 0,
      // opacity: 1,
    },
    shrunk: {
      transform: [{ translateY: height }],
      // transform: [{ scale: 0 }],
      // left: 0,
      // right: 0,
      // opacity: 0,
    },
  },
  overlay: {
    grown: {
      backgroundColor: 'rgba(0,0,0, 0.8)',
    },
    shrunk: {
      backgroundColor: 'transparent',
    },
  },
}

@autobind
export default class MeaningModal extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      words: [],
      containerStyle: {},
      wrapperStyle: {},
    }
  }

  open() {
    const { container, overlay } = this.refs

    this.setState({
      wrapperStyle: {
        ...StyleSheet.absoluteFillObject
      },
    }, () => {
      container.transitionTo(TRANSITION_STATES.container.grown, 500, 'ease-out-circ')
      overlay.transitionTo(TRANSITION_STATES.overlay.grown, 400)
    })

  }

  close() {
    const { container, overlay } = this.refs


    container.transitionTo(TRANSITION_STATES.container.shrunk, 500, 'ease-out-circ')
    overlay.transitionTo(TRANSITION_STATES.overlay.shrunk, 400)
    setTimeout(() => {
      this.setState({
        wrapperStyle: {
          // ...StyleSheet.absoluteFillObject
        },
      })
    }, 600)
  }

  render() {
    const { wrapperStyle } = this.state
    const { onSurrender } = this.props

    return (
      <Animatable.View
        style={[
          styles.wrapper,
          wrapperStyle,
        ]}
        ref="wrapper"
      >
        <Animatable.View
          ref="overlay"
          style={styles.overlay}
          pointerEvents="none"
        />
        <Animatable.View
          ref="container"
          style={[
            styles.container,
          ]}
        >
          <View style={{ flex: 1, }}>
            <TouchableOpacity onPress={this.close}>
              <Icon
                name="ios-close"
                size={35}
              />
            </TouchableOpacity>
            <MenuItem
              title="دیگه نیستم!"
              titleStyle={{
                color: 'red',
              }}
              onPress={() => {
                this.close()
                onSurrender()
              }}
            />
          </View>
        </Animatable.View>
      </Animatable.View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 99,
    elevation: 3,
  },
  container: {
    backgroundColor: '#fff',
    position: 'absolute',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    // width: 200,
    transform: [{ translateY: height }],
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    height: (height * 0.5),
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
})