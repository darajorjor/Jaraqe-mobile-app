import React from 'react';
import {
  View,
  Text,
  PanResponder,
  Animated,
  LayoutAnimation,
} from "react-native";
import { autobind } from 'core-decorators';
import uuid from 'uuid/v4';
import Draggable from '../Draggable'
import _ from 'lodash';

@autobind
export default class LetterBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      letters: [],
      floatingLetter: null,
      pan: new Animated.ValueXY(),
    };
  }

  componentWillMount() {
    this.setState({ letters: this.props.initialLetters.map(l => ({ value: l, id: uuid() })) })
  }

  onDrag({ x, y, item }) {
    console.log('LetterBar.onDrag')
    const { floatingTile } = this.refs;

    floatingTile.move({
      x,
      y,
    })
  }

  onDrop({ item, gestureState, nativeEvent }) {
    console.log('LetterBar.onDrop')
    const { floatingTile } = this.refs;

    this.setState({
      floatingLetter: false
    })
    floatingTile.responderReleaseHandler({ nativeEvent }, gestureState)
  }

  retakeLetter(letter, index) {
    console.log('LetterBar.retakeLetter')
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    const letters = [...this.state.letters]
    letters.splice(index, 0, letter)
    this.setState({
      letters: _.uniqBy(letters, 'id'),
    })
  }

  useLetter(id) {
    console.log('LetterBar.useLetter')
    const { letters } = this.state;

    // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({
      letters: letters.filter(l => l.id !== id)
    });
  }

  setDragStart({ x, y, item }) {
    console.log('LetterBar.setDragStart')
    this.setState({
      floatingLetter: item.isActive
    }, () => {
      const { floatingTile } = this.refs;

      floatingTile.place({
          x,
          y,
        }
      )
    })
  }

  checkDropZone({nativeEvent, gesture, letter, index = 0}) {
    console.log('LetterBar.checkDropZone')
    const { checkDropZone } = this.props;

    const matchedTile = checkDropZone(nativeEvent, gesture);

    if (matchedTile) {
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
      this.retakeLetter(letter, index)
    }

    return matchedTile
  }

  render() {
    const { letters, floatingLetter } = this.state;

    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          flexDirection: 'row',
          // backgroundColor: 'rgba(255,255,255, 0.7)',
          paddingVertical: 10
        }}
      >
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: 80,
            backgroundColor: 'rgba(255,255,255, 0.9)',
            borderTopWidth: 1,
            borderTopColor: '#eee'
          }}
        />
        {
          letters.map((letter, index) => (
            <Draggable
              key={letter.id}
              checkDropZone={(nativeEvent, gesture) => this.checkDropZone({
                nativeEvent,
                gesture,
                letter,
                index
              })}
            >
              <Text>{ letter.value }</Text>
            </Draggable>
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
          >
            <Text>{ floatingLetter.value }</Text>
          </Draggable>
        }
      </View>
    )
  }
}