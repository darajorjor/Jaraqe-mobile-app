import React from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import Jext from 'src/common/Jext'
import { navigate } from 'src/utils/helpers/navigation.helper'

const Navbar = ({ title, leftElement, rightElement, backable, navigator }) => (
  <View style={{ paddingTop: 80 }}>
    <View style={styles.wrapper}>
      <View style={{ position: 'absolute', left: 10, top: 0, bottom: 0, justifyContent: 'center' }}>
        { backable
          ? (
            <TouchableOpacity
              onPress={() => navigate(navigator ? { method: 'pop', navigator } : { method: 'dismissModal' })}
              style={{
                width: 45,
              }}
            >
              <Icon
                name={navigator ? 'ios-arrow-back' : 'ios-close'}
                size={navigator ? 30: 45}
                style={{ top: 3, left: 8, padding: 5 }}
              />
            </TouchableOpacity>
          )
          : leftElement
        }
      </View>
      {
        rightElement &&
        <View style={{ position: 'absolute', right: 10, top: 0, bottom: 0, justifyContent: 'center' }}>
          { rightElement }
        </View>
      }

      <Jext style={{ fontSize: 18 }}>{title}</Jext>
    </View>
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
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 99999,
  }
})

export default Navbar
