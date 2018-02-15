import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Carousel from 'react-native-snap-carousel'
import Jext from 'src/common/Jext'
import Jimage from 'src/common/Jimage'

const { width } = Dimensions.get('window')

export default class StoreCarousel extends React.Component {

  _renderItem ({item, index}) {
    return (
      <View style={styles.slide}>
        <Jimage
          source={{ uri: item.img }}
          style={{
            width,
            height: 200,
            zIndex: 9999,
          }}
        />
        <Jext
          style={{
            position: 'absolute',
            color: '#000',
            fontSize: 30,
            alignText: 'center',
          }}
        >{item.title}</Jext>
      </View>
    );
  }

  render() {
    return (
      <View>
        <Carousel
          data={this.props.items}
          renderItem={this._renderItem}
          sliderWidth={width}
          itemWidth={width}
          autoplay
          loop
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  slide: {
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {},
})
