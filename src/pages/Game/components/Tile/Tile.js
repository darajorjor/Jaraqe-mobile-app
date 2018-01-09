import React from 'react';
import {
  StyleSheet,
  View,
  Text
} from "react-native";
import { autobind } from 'core-decorators';

function getBackgroundColor(letter) {
  switch (letter) {
    case '+':
      return 'purple';
    case 'TL':
      return 'forestgreen';
    case 'DL':
      return 'darkcyan';
    case 'TW':
      return 'orange';
    case 'DW':
      return 'red';
    default:
      return '#ddd'
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
            backgroundColor: active ? 'skyblue' : getBackgroundColor(placeHolder),
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

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    height: 20,
    backgroundColor: '#ddd',
    borderRadius: 4,
  }
});

