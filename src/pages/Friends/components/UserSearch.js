import React from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
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
        { translateY: show ? (1 * height) : (2 * height) },
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
        <TextInput
          value={this.state.search}
          onChangeText={this.handleChange}
          style={styles.textInput}
          onFocus={() => this.toggleResults(true)}
          onBlur={() => this.toggleResults(false)}
        />
        <Icon
          name='ios-search'
          style={styles.icon}
          size={25}
          color='#eee'
        />

        <Animatable.View
          ref="results"
          style={[
            styles.results,
            {
              transform: [
                { translateY: 2 * height }
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
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    padding: 20,
    justifyContent: 'center'
  },
  textInput: {
    fontSize: 16,
    textAlign: 'right',
    marginRight: 28,
  },
  icon: {
    position: 'absolute',
    right: 16,
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
    height,
    zIndex: 999,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  }
})