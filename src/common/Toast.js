import React from 'react';
import {
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { navigate } from 'src/utils/helpers/navigation.helper'
import Jext from 'src/common/Jext'

const { width } = Dimensions.get('window')

function getColors(status) {
  switch (status) {
    case 'success':
      return {
        color: '#fff',
        backgroundColor: 'forestgreen',
        borderColor: '#fff',
      }
    case 'error':
      return {
        color: '#fff',
        backgroundColor: 'red',
        borderColor: 'red',
      }
    case 'info':
    default:
      return {
        color: '#000',
        backgroundColor: '#fff',
        borderColor: '#eee',
      }
  }
}

const Toast = ({ status, title }) => {
  const { backgroundColor, borderColor, color } = getColors(status)

  return (
    <TouchableOpacity
      onPress={() => navigate({ method: 'dismissInAppNotification' })}
      activeOpacity={0.9}
      style={{
        width,
        height: 80,
        padding: 10,
        backgroundColor,
        borderColor,
        borderBottomWidth: 1,
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
    >
      <Jext f={18} style={{ color }}>{ title }</Jext>
    </TouchableOpacity>
  )
}
export default Toast
