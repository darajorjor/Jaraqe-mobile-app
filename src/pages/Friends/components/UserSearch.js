import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Platform,
} from 'react-native';
import Jext from 'src/common/Jext'
import { autobind } from 'core-decorators'
import Icon from 'react-native-vector-icons/Ionicons'
import * as Animatable from 'react-native-animatable'
import api from 'src/utils/apiHOC'
import MenuItem from 'src/common/MenuItem'
import { navigate } from '../../../utils/helpers/navigation.helper'

const { height } = Dimensions.get('window')

@api({
  url: 'users/search',
  method: 'GET',
  name: 'search',
  options: {
    instantCall: false,
  }
})
@autobind
export default class UserSearch extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      search: '',
    }
  }

  handleChange(text) {
    const { data: { searchRefetch } } = this.props

    searchRefetch({
      query: {
        query: text,
      }
    })
    this.setState({ search: text })
  }

  toggleResults(show) {
    const { results } = this.refs

    results.transitionTo({
      transform: [
        { translateY: show ? 0 : height },
      ]
    }, 400, 'ease-in-out-quart')
  }

  openUserProfile(user) {
    return navigate({
      screen: 'UserProfile',
      method: 'showModal',
      options: {
        passProps: {
          profile: user,
        }
      }
    })
  }

  render() {
    const { data: { search, searchLoading, searchError } } = this.props

    return (
      <View style={styles.wrapper}>
        <View style={{ justifyContent: 'center' }}>
          <TextInput
            value={this.state.search}
            onChangeText={this.handleChange}
            style={styles.textInput}
            onFocus={() => this.toggleResults(true)}
            onBlur={() => this.toggleResults(false)}
            underlineColorAndroid='transparent'
          />
          <Icon
            name='ios-search'
            style={styles.icon}
            size={25}
            color='#eee'
          />
        </View>

        <Animatable.View
          ref="results"
          style={[
            styles.results,
            {
              transform: [
                { translateY: height }
              ],
            },
          ]}
        >
          {
            (() => {
              if (searchLoading) {
                return <ActivityIndicator />
              }

              if (searchError) {
                return <Jext>یچیزی خراب شد :(</Jext>
              }

              return (search || []).map((user) => (
                <MenuItem
                  title={user.username || user.fullName}
                  onPress={() => this.openUserProfile(user)}
                />
              ))
            })()
          }
        </Animatable.View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 20,
  },
  textInput: {
    fontSize: 16,
    textAlign: 'right',
    marginRight: 28,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  icon: {
    position: 'absolute',
    right: 0,
    transform: [
      {
        rotate: '90deg'
      }
    ]
  },
  results: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.select({
      ios: height - 200,
      android: height - 230,
    }),
    zIndex: 999,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  }
})