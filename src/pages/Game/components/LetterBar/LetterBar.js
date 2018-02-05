import React from 'react'
import {
  View,
  PanResponder,
  Animated,
  LayoutAnimation,
  Dimensions,
} from "react-native"
import { autobind } from 'core-decorators'
import uuid from 'uuid/v4'
import Draggable  from '../Draggable'
import _ from 'lodash'
import Jext from 'src/common/Jext'

const { height, width } = Dimensions.get('window')
const DRAGGABLE_WIDTH = ((width / 7) - 10)

@autobind
export default class LetterBar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      letters: [],
      floatingLetter: null,
      pan: new Animated.ValueXY(),
    }
  }

  componentWillMount() {
    this.setState({ letters: this.props.initialLetters })
  }

  componentWillReceiveProps(np) {
    if (!_.isEqual(this.props.initialLetters, np.initialLetters)) {
      this.setState({ letters: np.initialLetters })
    }
  }

  insertEmptySeat(index) {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    let letters = [...this.state.letters]
    if (letters[index]) {
      console.log('LetterBar.insertEmptySeat')
      letters = letters.filter(Boolean)
      letters.splice(index, 0, null)
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
      this.insertIndex = index
      this.setState({
        letters,
      })
    }
  }

  onDrag({ gesture, nativeEvent, item }) {
    console.log('LetterBar.onDrag')
    const { floatingTile } = this.refs
    const { letters } = this.state

    if (nativeEvent.pageY > (height - 150)) {
      const tileSize = DRAGGABLE_WIDTH + 10
      const widthFromRight = (width - (letters.length * (tileSize)))
      let index = Math.floor(((nativeEvent.pageX) / tileSize))
      if (index > letters.length) {
        index = letters.length
      }
      this.insertEmptySeat(index)
    } else {
      if (letters.includes(null)) {
        this.setState({
          letters: letters.filter(Boolean)
        })
      }
    }

    floatingTile.move({
      x: gesture.dx,
      y: gesture.dy
    })
  }

  onDrop({ item, gestureState, nativeEvent }) {
    console.log('LetterBar.onDrop')
    const { floatingTile } = this.refs
    const { letters } = this.state

    this.setState({
      floatingLetter: false,
    })
    floatingTile.responderReleaseHandler({ nativeEvent }, gestureState)
  }

  retakeLetter(letter, index) {
    console.log('LetterBar.retakeLetter')
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    let letters = [...this.state.letters]
    letters.splice(index, 0, letter)
    letters = letters.filter(Boolean)
    this.setState({
      letters: _.uniqBy(letters, 'id'),
    })
  }

  useLetter(id) {
    console.log('LetterBar.useLetter')
    const { letters } = this.state

    // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring)
    this.setState({
      letters: letters.filter(l => l && l.id !== id)
    })
  }

  setDragStart({ x, y, item }) {
    console.log('LetterBar.setDragStart')
    this.setState({
      floatingLetter: item.isActive
    }, () => {
      const { floatingTile } = this.refs

      floatingTile.place({
        x,
        y,
      })
    })
  }

  checkDropZone({ nativeEvent, gesture, letter, index = 0 }) {
    console.log('LetterBar.checkDropZone')
    const { checkDropZone } = this.props

    if (this.insertIndex) {
      index = this.insertIndex
    }

    const matchedTile = checkDropZone(nativeEvent, gesture)

    if (!!matchedTile && !matchedTile.letter) {
      if (matchedTile.isActive) {
        const o = { ...matchedTile.isActive }
        matchedTile.handle.activate(letter)
        this.useLetter(letter.id)
        this.retakeLetter(o, index)
      } else {
        matchedTile.handle.activate(letter)
        this.useLetter(letter.id)
      }

      matchedTile.zoom()
    } else {
      console.log('didn\'t found anything')
      this.retakeLetter(letter, index)
    }

    return matchedTile
  }

  render() {
    const { letters, floatingLetter } = this.state

    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          flexDirection: 'row',
          // backgroundColor: 'rgba(255,255,255, 0.7)',
          paddingVertical: 10,
        }}
      >
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: height / 10,
            backgroundColor: 'rgba(255,255,255, 0.9)',
            borderTopWidth: 1,
            borderTopColor: '#eee'
          }}
        />
        {
          letters.map((letter, index) => (
            letter
              ?
              <Draggable
                key={letter.id}
                checkDropZone={(nativeEvent, gesture) => this.checkDropZone({
                  nativeEvent,
                  gesture,
                  letter,
                  index
                })}
                style={{
                  width: DRAGGABLE_WIDTH,
                }}
              >
                <Jext style={{ position: 'absolute', right: 3, top: 3, fontSize: 7 }}>{letter.point}</Jext>
                <Jext>{ letter.value }</Jext>
              </Draggable>
              :
              <View style={{ width: DRAGGABLE_WIDTH, marginHorizontal: 10 }} />
          ))
        }

        {
          !!floatingLetter &&
          <Draggable
            ref='floatingTile'
            key='floatingTile'
            checkDropZone={(nativeEvent, gesture) => this.checkDropZone({
              nativeEvent,
              gesture,
              letter: floatingLetter,
            })}
            style={{
              width: DRAGGABLE_WIDTH,
            }}
          >
            <Jext style={{ position: 'absolute', right: 3, top: 3, fontSize: 7 }}>{floatingLetter.point}</Jext>
            <Jext>{ floatingLetter.value }</Jext>
          </Draggable>
        }
      </View>
    )
  }
}