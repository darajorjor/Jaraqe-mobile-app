import React from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  View,
  Button,
  PanResponder,
} from "react-native"
import { autobind } from 'core-decorators'
import * as Animatable from 'react-native-animatable'
import Jext from 'src/common/Jext'
import Icon from 'react-native-vector-icons/Ionicons'
import Tile from '../Tile/Tile'
import api from 'src/utils/ApiHOC'
import t from 'src/utils/translate'

const { height } = Dimensions.get('window')

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

@api((props) => ({
  url: `games/${props.gameId}/swap`,
  method: 'POST',
  name: 'swap',
}))
@autobind
export default class SwapModal extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      words: [],
      containerStyle: {},
      wrapperStyle: {},
      tileCoordinates: [],
      open: false,
    }
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (e, gesture) => this.state.open,
      onPanResponderMove: this.responderMoveHandler,
      onPanResponderGrant: this.responderGrantHandler,
      onPanResponderRelease: this.responderReleaseHandler
    })
  }

  responderMoveHandler = ({ nativeEvent }, gesture) => {
    if (this.draggingItem) {
      this.draggingItem.moved = true
      this.props.onDrag({
        item: this.draggingItem,
        gesture,
        nativeEvent,
      })
    }
  }

  responderGrantHandler = ({ nativeEvent }, gesture) => {
    const item = this.checkTileMatching(nativeEvent, { moveX: nativeEvent.pageX, moveY: nativeEvent.pageY })

    if (item && item.isActive) {
      this.draggingItem = item
      this.draggingItem.handle.activate()
      this.props.setDragStart({
        item,
        x: nativeEvent.pageX,
        y: nativeEvent.pageY,
      })
    }
  }

  responderReleaseHandler = ({ nativeEvent }, gesture) => {
    if (this.draggingItem) {
      if (this.draggingItem.moved) {
        this.props.onDrop({
          item: this.draggingItem,
          gestureState: gesture,
          nativeEvent
        })
      } else {
        this.props.onDrop({
          item: this.draggingItem,
          gestureState: {
            moveX: gesture.x0,
            moveY: gesture.y0,
          },
          nativeEvent
        })
      }
      this.draggingItem = null
    }
  }

  open(isPlus) {
    const { container, overlay } = this.refs

    this.setState({
      wrapperStyle: {
        ...StyleSheet.absoluteFillObject
      },
      open: isPlus ? 'plus' : true,
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
        open: false,
      })
    }, 600)
  }

  isOpen = () => this.state.open

  renderPlaceholders() {
    const tileCoordinates = []
    let tileCoordinatesCount = 0

    return [1, 2, 3, 4, 5, 6, 7].map((tile, index) => (
      <Tile
        key={`placeholder-${index}`}
        ref={`placeholder-${index}`}
        onGrab={() => alert('fuck')}
        style={{
          borderRadius: 10,
        }}
        onRender={(ref) => {
          ref.measure((x, y, width, height, pageX, pageY) => {
            tileCoordinatesCount++
            tileCoordinates[index] = {
              ref: `placeholder-${index}`,
              rectangle: {
                x2: pageX + width,
                x1: pageX,
                y2: pageY + width,
                y1: pageY
              },
              width,
              height,
              pageX,
              pageY,
            }

            if (tileCoordinatesCount === 7) {
              this.setState({ tileCoordinates })
            }
          })
        }}
      />
    ))
  }

  checkTileMatching(nativeEvent, gesture) {
    console.log('Board.checkTileMatching')
    const { tileCoordinates } = this.state

    const point = {
      x: gesture.moveX,
      y: gesture.moveY
    }

    if (nativeEvent.pageY > (height - 150)) {
      return null
    }

    let minDistance = 100
    let closestTile = null

    tileCoordinates.forEach(({ rectangle, ...rest }) => {
      const x1 = (rectangle.x1)
      const y1 = (rectangle.y1)
      const x2 = x1 + ((rest.width * 1) + 4)
      const y2 = y1 + ((rest.height * 1) + 4)

      const rectangleCenter = {
        x: x2 - ((x2 - x1) / 2),
        y: y2 - ((y2 - y1) / 2),
      }

      console.log('rectangleCenter', rectangleCenter)
      console.log('point', point)
      const distance = Math.hypot(rectangleCenter.x - point.x, (rectangleCenter.y - height) - point.y)
      console.log('distance', distance)

      if (distance < minDistance) {
        minDistance = distance
        closestTile = {
          x: x1,
          y: y1,
          ...rest
        }
      }
    })

    if (closestTile) {
      const { [closestTile.ref]: tileRef } = this.refs

      return {
        ...closestTile,
        handle: tileRef,
        isActive: tileRef.isActive(),
        zoom: () => {
        },
      }
    }

    return null
  }

  submit() {
    const { data: { swap }, onRackChange, powerUps, setProfileField } = this.props
    const { open } = this.state

    const tileRefs = Object.keys(this.refs).filter(ref => ref.includes('placeholder'))

    const letters = []
    tileRefs.map(ref => {
      const tile = this.refs[ref]

      if (tile.isActive()) {
        letters.push(tile.isActive().id)
        tile.activate()
      }
    })

    swap({
      body: {
        isPlus: open === 'plus',
        letters,
      },
    })
      .then(({ rack }) => {
        onRackChange(rack)
        setProfileField('powerUps.swapPlus', powerUps.swapPlus - 1)
        this.close()
      })
  }

  render() {
    const { wrapperStyle, open } = this.state

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
          <View
            {...this.panResponder.panHandlers}
            style={{ flex: 1 }}
          >
            <TouchableOpacity onPress={this.close}>
              <Icon
                name="ios-close"
                size={35}
              />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                marginBottom: 40,
              }}
            >
              <Jext>{ open === 'plus' ? t('تعویض واژه +') : t('تعویض واژه با رد نوبت')}</Jext>

              <View style={{ flexDirection: 'row', }}>
                { this.renderPlaceholders() }
              </View>

              <View
                style={{
                  position: 'absolute',
                  bottom: 16,
                }}
              >
                <Button
                  title='تعویض'
                  onPress={this.submit}
                />
              </View>
            </View>
          </View>
        </Animatable.View>
      </Animatable.View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    zIndex: 1,
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