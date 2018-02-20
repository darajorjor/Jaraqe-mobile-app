import React, { Component } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
  Platform,
} from 'react-native'
import { connect } from 'react-redux'
import config from 'src/config'
import Navbar from 'src/common/Navbar'
import Jext from 'src/common/Jext'
import StoreCarousel from './components/StoreCarousel'
import Shelf from './components/Shelf'
import api from 'src/utils/ApiHOC'
import { autobind } from 'core-decorators'
import { setProfileField } from '../../redux/Main.reducer'
import SafariView from 'react-native-safari-view'
import getStorageItem from "../../utils/getStorageItem";

@api({
  url: 'store',
  method: 'GET',
  name: 'storeInfo',
})
@api({
  url: 'store/purchase',
  method: 'POST',
  name: 'purchase',
})/*
@api({
  url: 'store/purchase-coin',
  method: 'POST',
  name: 'purchaseCoin',
})*/
@connect(
  state => ({
    profile: state.Main.profile,
  }),
  { setProfileField }
)
@autobind
export default class Store extends Component {
  componentDidMount() {
    Linking.addEventListener('url', this.handleOpenURL);
    // Launched from an external URL
    Linking.getInitialURL().then((url) => {
      if (url) {
        this.handleOpenURL({ url });
      }
    });
  }

  componentWillUnmount() {
    // Remove event listener
    Linking.removeEventListener('url', this.handleOpenURL);
  }

  handleOpenURL = ({ url }) => {
    // Extract stringified user string out of the URL
    const [, user_string] = url.match(/user=([^#]+)/);
    const { setProfileField } = this.props

    try {
      const { user, status } = JSON.parse(decodeURI(user_string))

      if (status === 'ok') {
        setProfileField('coins', user.coins)
      }
      if (Platform.OS === 'ios') {
        SafariView.dismiss();
      }
    } catch (e) {
      console.error(e)
    }
  }

  handleItemPurchase(item) {
    const { data: { purchase }, setProfileField } = this.props

    Alert.alert(
      `خرید ${item.title}`,
      `آیا از خرید ${item.title} با قیمت ${item.price} کبریت مطمئنید؟`,
      [
        {
          text: 'بیخیال',
          style: 'cancel'
        },
        {
          text: 'آره',
          onPress: () => {
            purchase({
              body: {
                itemName: item.name,
              }
            })
              .then((profile) => setProfileField('powerUps', profile.powerUps))
          }
        },
      ],
    )
  }

  handleCoinPurchase(item) {
    const { data: { purchaseCoin } } = this.props

    Alert.alert(
      `خرید ${item.title}`,
      `آیا از خرید ${item.title} با قیمت ${item.price} تومان مطمئنید؟`,
      [
        {
          text: 'بیخیال',
          style: 'cancel'
        },
        {
          text: 'آره',
          onPress: async () => {
            const url = `${config.api}/store/purchase-coin?session=${await getStorageItem('session')}&itemName=${item.name}`
            if (Platform.OS === 'ios') {
              SafariView.isAvailable()
                .then(SafariView.show({
                  url,
                  fromBottom: true,
                }))
                .catch(error => {
                  console.error(error)
                  // Fallback WebView code for iOS 8 and earlier
                });
            } else {
              Linking.openURL(url);
            }
          }
        },
      ],
    )
  }

  render() {
    const { profile, data: { storeInfo } } = this.props

    if (!storeInfo) return null

    return (
      <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
        <Navbar
          title="بوفه"
          leftElement={profile && <Jext>{ profile.coins } کبریت</Jext>}
        />
        <View style={styles.itemBar}>
          <Jext>تعویض پلاس: { profile.powerUps.swapPlus }</Jext>
        </View>
        <ScrollView
          style={{ flex: 1 }}
          bounces={false}
        >
          <StoreCarousel
            items={[
              {
                title: 'تعویض پلاس رایگان!',
                img: 'https://meetinmontauk.files.wordpress.com/2017/12/jamaica_1_bob_marley.jpg?w=474'
              },
              {
                title: 'آیتم خوب دیگه',
                img: 'https://meetinmontauk.files.wordpress.com/2017/12/jamaica_1_bob_marley.jpg?w=474'
              },
              {
                title: 'تعویض پلاس رایگان!',
                img: 'https://meetinmontauk.files.wordpress.com/2017/12/jamaica_1_bob_marley.jpg?w=474'
              },
            ]}
          />
          <Shelf
            title="تعویض پلاس"
            subtitle="بدون از دست دادن نوبت واژه تعویض کنید"
            items={storeInfo.swapPlus}
            onItemPress={this.handleItemPurchase}
            style={{
              marginTop: 16,
            }}
          />
          <Shelf
            title="کبریت"
            items={storeInfo.coins}
            onItemPress={this.handleCoinPurchase}
            style={{
              marginVertical: 16,
            }}
          />
          {/*<Shelf
           title="سیبیل زئوس"
           items={DEFAULT_ITEMS}
           onItemPress={() => null}
           style={{
           marginVertical: 16,
           }}
           />
           <Shelf
           title="گردنبند پوسایدون"
           items={DEFAULT_ITEMS}
           onItemPress={() => null}
           style={{
           marginBottom: 16,
           }}
           />*/}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  itemBar: {
    height: 50,
    backgroundColor: 'rgba(255,255,255, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
})
