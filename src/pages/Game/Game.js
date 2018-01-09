import React from 'react';
import {
  View,
  Text,
} from 'react-native';
import Board from './components/Board';

export default class Game extends React.Component {
  render() {
    return (
      <View style={{ flex: 1  }}>
        <Board />
      </View>
    )
  }
}