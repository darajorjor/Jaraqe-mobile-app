import React, { Component } from 'react'
import {
  View,
  ScrollView,
} from 'react-native'
import { connect } from 'react-redux'
import Navbar from 'src/common/Navbar'
import Jext from 'src/common/Jext'
import StoreCarousel from './components/StoreCarousel'
import Shelf from './components/Shelf'

const DEFAULT_ITEMS = [
  {
    id: '',
    name: '',
    img: '',
    count: 2,
    price: 200,
  },
  {
    id: '',
    name: '',
    img: '',
    count: 5,
    price: 200,
  },
  {
    id: '',
    name: '',
    img: '',
    count: 20,
    price: 200,
  },
  {
    id: '',
    name: '',
    img: '',
    count: 50,
    price: 200,
  },
  {
    id: '',
    name: '',
    img: '',
    count: 100,
    price: 200,
  }
]

@connect(
  state => ({
    profile: state.Main.profile,
  })
)
export default class Store extends Component {
  render() {
    const { profile } = this.props

    return (
      <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
        <Navbar
          title="بوفه"
          leftElement={profile && <Jext>{ profile.coins } سکه</Jext>}
        />
        <ScrollView
          style={{ flex: 1 }}
          bounces={false}
        >
        <StoreCarousel
          items={[
            {
              title: 'یه آیتم خوب',
              img: 'https://meetinmontauk.files.wordpress.com/2017/12/jamaica_1_bob_marley.jpg?w=474'
            },
            {
              title: 'آیتم خوب دیگه',
              img: 'https://meetinmontauk.files.wordpress.com/2017/12/jamaica_1_bob_marley.jpg?w=474'
            },
            {
              title: 'پروردگار آیتما',
              img: 'https://meetinmontauk.files.wordpress.com/2017/12/jamaica_1_bob_marley.jpg?w=474'
            },
          ]}
        />
          <Shelf
            title="پتک تور"
            items={DEFAULT_ITEMS}
            style={{
              marginTop: 16,
            }}
          />
          <Shelf
            title="سیبیل زئوس"
            items={DEFAULT_ITEMS}
            style={{
              marginVertical: 16,
            }}
          />
          <Shelf
            title="گردنبند پوسایدون"
            items={DEFAULT_ITEMS}
            style={{
              marginBottom: 16,
            }}
          />
        </ScrollView>
      </View>
    )
  }
}