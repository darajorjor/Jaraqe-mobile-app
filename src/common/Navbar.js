import React from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { navigate } from 'src/utils/helpers/navigation.helper'

const { width } = Dimensions.get('window')

const Navbar = ({ title, leftElement, isModal }) => (
  <View style={{ paddingTop: 80 }}>
    <View style={styles.wrapper}>
      { isModal
        ? (
          <TouchableOpacity onPress={() => navigate({ method: 'dismissModal' })} activeOpacity={0.7}>
            <Icon name="ios-close" size={45} style={{ top: 3, left: 8 }} />
          </TouchableOpacity>
        )
        : leftElement
      }
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    zIndex: 99999,
  }
})

export default Navbar
