import React from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  ScrollView,
  View,
  WebView,
} from "react-native"
import { autobind } from 'core-decorators'
import * as Animatable from 'react-native-animatable'
import Jext from 'src/common/Jext'
import api from 'src/utils/apiHOC'
import Icon from 'react-native-vector-icons/Ionicons'

const { height, width } = Dimensions.get('window')

const TRANSITION_STATES = {
  container: {
    grown: {
      transform: [{ scale: 1 }],
      top: 50,
      left: 0,
      right: 0,
      opacity: 1,
    },
    shrunk: {
      transform: [{ scale: 0 }],
      left: 0,
      right: 0,
      opacity: 0,
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

@api({
  url: 'words',
  method: 'GET',
  name: 'wordsInfo',
  options: {
    instantCall: false,
  },
})
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

  grow(from, words) {
    const { container, overlay } = this.refs
    const { data: { wordsInfoRefetch } } = this.props
    this.startingPosition = from

    wordsInfoRefetch({
      query: {
        words,
      }
    })

    this.setState({
      containerStyle: {
        left: (from.x - (height * 0.4)),
        top: (from.y - (height * 0.4)),
      },
      wrapperStyle: {
        ...StyleSheet.absoluteFillObject
      },
      words,
    }, () => {
      container.transitionTo(TRANSITION_STATES.container.grown)
      overlay.transitionTo(TRANSITION_STATES.overlay.grown)
    })

  }

  shrink() {
    const { container, overlay } = this.refs
    if (!this.startingPosition) return null

    container.transitionTo({
      ...TRANSITION_STATES.container.shrunk,
      left: (this.startingPosition.x - (height * 0.4)),
      top: (this.startingPosition.y - (height * 0.4)),
    })
    overlay.transitionTo(TRANSITION_STATES.overlay.shrunk)
    this.startingPosition = null

    setTimeout(() => {
      this.setState({
        wrapperStyle: {
          // ...StyleSheet.absoluteFillObject
        },
      })
    }, 500)
  }

  render() {
    const { containerStyle, wrapperStyle, words } = this.state
    const { data: { wordsInfo, wordsInfoLoading, wordsInfoError } } = this.props

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
            containerStyle,
            wordsInfoLoading ? {
              justifyContent: 'center',
              alignItems: 'center'
            } : null,
          ]}
        >

          <View style={{ flex: 1, }}>
            <TouchableOpacity onPress={this.shrink}>
              <Icon
                name="ios-close"
                size={35}
              />
            </TouchableOpacity>
            <ScrollView style={{ flex: 1 }}>
              {
                wordsInfoLoading &&
                <ActivityIndicator />
              }
              {
                wordsInfoError &&
                <Jext>خطایی رخ داد :(</Jext>
              }

              {
                !wordsInfoLoading &&
                !wordsInfoError &&
                wordsInfo &&
                wordsInfo.map((wordInfo) => (
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Jext style={{ fontSize: 18, fontWeight: 'bold' }}>{wordInfo.word}</Jext>
                    {
                      wordInfo.definitions.map(({ text }) => (
                        <Jext>{text}</Jext>
                      ))
                    }

                    {
                      wordInfo.wiki.map(({ title, pageId }) => (
                        <WebView
                          source={{
                            uri: `https://fa.m.wikipedia.org?curid=${pageId}`
                          }}
                          startInLoadingState
                          style={{
                            flex: 1,
                            width: width - 20,
                            height: (height * 0.5),
                          }}
                        />
                      ))
                    }
                  </View>
                ))
              }
            </ScrollView>
          </View>
        </Animatable.View>
      </Animatable.View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 9999,
    elevation: 3,
  },
  container: {
    backgroundColor: '#fff',
    position: 'absolute',
    borderRadius: 4,
    // width: 200,
    top: 50,
    padding: 10,
    height: (height * 0.8),
    transform: [
      {
        scale: 0.1,
      }
    ]
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
})