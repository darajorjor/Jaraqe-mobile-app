import React from 'react';
import {
  View,
  Text
} from "react-native";
import { autobind } from 'core-decorators';

function getBackgroundColor(letter) {
  switch (letter) {
    case '+':
      return '#9575CD';
    case 'TL':
      return '#4CAF50';
    case 'DL':
      return '#4DB6AC';
    case 'TW':
      return '#FF9800';
    case 'DW':
      return '#FF5722';
    default:
      return '#E0E0E0'
  }
}

@autobind
export default class Tile extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      active: false
    };
  }

  activate(letter) {
    console.log('Tile.activate')

    this.setState({ active: letter })
  }

  isActive() {
    return this.state.active
  }

  render() {
    const { style, onRender, placeHolder, onGrab } = this.props;
    const { active } = this.state;

    return (
      <View
        ref='root'
        style={[
          {
            flex: 1,
            aspectRatio: 1,
            // width: 25,
            // height: 25,
            // height: wrapper === 'grown' ? (((width * 2) / tileMap.length) - margin) - 2.1 : ((width / tileMap.length) - margin) - 2.1,
            borderRadius: 4,
            backgroundColor: active ? '#FFC107' : getBackgroundColor(placeHolder),
            justifyContent: 'center',
            alignItems: 'center'
          },
          style,
        ]}
        onLayout={() => onRender(this.refs.root)}
      >
        <Text>{ !!active ? active.value : placeHolder }</Text>
      </View>
    )
  }
}