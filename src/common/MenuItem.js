import React from 'react';
import {
  View,
  StyleSheet,
  TouchableHighlight,
  Dimensions,
  ActivityIndicator,
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Jext from 'src/common/Jext'

const { width } = Dimensions.get('window');

export default MenuItem = ({ title, titleStyle, rightIcon, leftIcon, rightIconStyle, onPress, style, noBorder, loading, disabled, ...props }) => {
  const Wrapper = onPress ? Platform.OS === 'ios' ? TouchableHighlight : TouchableOpacity : View;

  return (
    <Wrapper disabled={disabled} onPress={loading ? () => {
    } : onPress} nativeProps={{
      useForeground: Platform.OS === 'android' ? TouchableNativeFeedback.canUseNativeForeground() : undefined
    }}>
      <View {...props} style={[styles.wrapper, { paddingRight: rightIcon ? (32 + 30) : 16 }, style]}>
        { !!rightIcon && <View style={[styles.rightIcon, rightIconStyle]}>{ rightIcon }</View> }
        <Jext style={titleStyle}>{ title }</Jext>
        <View style={styles.arrow}>
          {
            loading
              ? <ActivityIndicator />
              :
              !!leftIcon
                ? leftIcon
                : !!onPress && <Icon
                  name='ios-arrow-back'
                  size={25}
                  color='#eee'
                />
          }
        </View>
        { !noBorder && <View style={[styles.border, { width: rightIcon ? width - 62 : width }]} />}
      </View>
    </Wrapper>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#fff',
    height: 50,
    // borderBottomWidth: 1,
    // borderBottomColor: '#eee',
  },
  border: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: '#e0e0e0',
    height: StyleSheet.hairlineWidth,
  },
  rightIcon: {
    paddingTop: 4,
    position: 'absolute',
    right: 16,
    alignSelf: 'center',
  },
  arrow: {
    position: 'absolute',
    left: 16,
  },
});