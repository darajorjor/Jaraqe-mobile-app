import React from 'react'
import Jimage from './Jimage'

export default Avatar = ({ online, style, ...props }) => (
  <Jimage
    {...props}
    style={[ online ?{
      borderWidth: 3,
      borderColor: '#19ca30'
    } : null, style]}
  />
)