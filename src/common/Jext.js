import React from 'react';
import {
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import {
  scale
} from 'src/utils/helpers/font.helper';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  wrapper: {
    fontFamily: 'IRANYekanFaNum',
    backgroundColor: 'transparent',
    // fontSize: 14,
    color: '#424242',
    textAlign: 'center',
    maxWidth: width - 32
  },
  onPress: {
    color: 'red',
  }
});

const Jext = ({ style, children, numberOfLines, onPress, autoAdjust }) => (
  <Text
    allowFontScaling={false}
    numberOfLines={numberOfLines}
    onPress={onPress}
    // pointerEvents={onPress ? 'auto' : 'none'}
    style={[
      styles.wrapper,
      onPress ? styles.onPress : undefined,
      { fontSize: autoAdjust ? scale(14) : 14 },
      style,
    ]}
  >{ children }</Text>
)

export default Jext