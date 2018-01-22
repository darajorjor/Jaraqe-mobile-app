import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export function scale(fontSize, factor = 24) {
  return ((width / factor) > fontSize ? fontSize : (width / factor))
}