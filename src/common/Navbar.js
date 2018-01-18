import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window')

const Navbar = ({ leftElement }) => (
  <View style={styles.wrapper}>
    { leftElement }
  </View>
)

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#fafafa',
    padding: 16,
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  }
})

export default Navbar
