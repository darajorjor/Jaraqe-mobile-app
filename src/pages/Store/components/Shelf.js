import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Jext from 'src/common/Jext'

const Shelf = ({ title, items, style }) => (
  <View style={[styles.wrapper, style]}>
    <Jext style={styles.title}>{ title }</Jext>

    <ScrollView
      // ref={ref => ref.scrollToEnd()}
      style={styles.scrollView}
      // contentContainerStyle={{ justifyContent: 'flex-end' }}
      horizontal
      bounces={false}
      showsHorizontalScrollIndicator={false}
    >
      {
        items.map((item) => (
          <View
            style={styles.item}
          >
            <Jext>{ item.count }</Jext>
          </View>
        ))
      }
    </ScrollView>
  </View>
)

const styles = StyleSheet.create({
  wrapper: {
    // height: 150,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  item: {
    width: 75,
    height: 75,
    marginHorizontal: 16,
    backgroundColor: '#ddd',
    borderRadius: 4,
    transform: [{ scaleX: -1 }],
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flexDirection: 'row',
    transform: [{ scaleX: -1 }],
    paddingVertical: 32,
  },
  title: {
    marginRight: 16,
    top: 10,
    fontSize: 20,
  },
})

export default Shelf
