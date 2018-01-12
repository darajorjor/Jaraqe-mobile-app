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
    const { floatingTile } = this.refs;

    // console.log('shit')

    floatingTile.move({
      x,
      y,
    })

    /*
        this.setState({
          floatingLetter: item.isActive,
        }, () => {
          debugger;
          floatingTile.move({
            x: draggableX,
            y: draggableY,
          })
        })
    */
  }

  retakeLetter(letter) {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({
      letters: [
        ...this.state.letters,
        letter
      ]
    })
  }

  useLetter(id) {
    const { letters } = this.state;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({
      letters: letters.filter(l => l.id !== id)
    });
  }

  setDragStart({ x, y }) {
    this.setState({
      floatingLetter: {
        left: x,
        top: y,
      }
    })
  }

  render() {
    const { letters, floatingLetter, pan } = this.state;
    const { checkDropZone } = this.props;

    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          flexDirection: 'row',
        }}
      >
        {
          letters.map((letter, index) => (
            <Draggable
              key={letter.id}
              checkDropZone={(gesture) => {
                const matchedTile = checkDropZone(gesture, letter);

                if (matchedTile) {
                  this.useLetter(letter.id)
                }

                return matchedTile
              }}
            >
              <Text>{ letter.value }</Text>
            </Draggable>
          ))
        }

        <Draggable
          ref='floatingTile'
          key='floatingTile'
          checkDropZone={(gesture) => {
            //
          }}
          style={{
            position: 'absolute',
            left: 100,
            top: 100,
          }}
        >
          <Text>M</Text>
        </Draggable>

      </View>
    )
  }
}