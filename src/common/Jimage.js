import React from 'react';
import {
  Platform,
  Image
} from 'react-native';
import { createImageProgress } from 'react-native-image-progress';
import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';
const ImageComponent = Platform.OS === 'ios' ? createImageProgress(FastImage) : Image;

export default HImage = (props) => (
  <ImageComponent
    indicator={Progress.Pie}
    {...props}
    indicatorProps={{
      size: 80,
      borderWidth: 0,
      color: 'rgba(0, 166, 159, 0.5)',
      indeterminate: false,
      ...props.indicatorProps,
    }}
  />
)