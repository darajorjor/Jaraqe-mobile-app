/* eslint-disable no-shadow,react/no-unused-state */
import React from 'react'
import { AsyncStorage } from 'react-native'
import Qs from 'qs'
import { connect } from 'react-redux'

import ApiCaller from './ApiCaller'

const callApi = new ApiCaller()
const CACHE_KEY = 'apihoc_cache'

const api = ({ url, method, name, query, options = { instantCall: true } }) => {
  method = method.toUpperCase()

  async function getCachedData() {
    let data = await AsyncStorage.getItem(`${CACHE_KEY}:${method}:${url}`)
    if (data) {
      try {
        data = JSON.parse(data)

        return data
      } catch (e) {
        console.error('apiHOC.getCachedData', data)
        return null
      }
    }

    return null
  }

  async function setCachedData(data) {
    return AsyncStorage.setItem(`${CACHE_KEY}:${method}:${url}`, JSON.stringify(data))
  }

  return (Comp) => class extends React.Component {
    constructor(props) {
      super(props)

      this.apiInstance = null
      this.state = {
        loading: false,
        error: null,
        data: null,
      }
    }

    componentDidMount() {
      this.call = this.call.bind(this.call)

      if (method === 'GET' && options.instantCall) {
        this.call({ query })
      }
    }

    componentWillUnmount() {
      if (this.apiInstance) {
        this.apiInstance.cancel()
      }
    }

    getData = (self) => {
      const { loading, error, data } = self.state

      const result = Object.assign({}, self.props.data, {
        [`${name}Loading`]: loading,
        [`${name}Error`]: error,
        [name]: data,
      })

      if (method === 'POST' || method === 'PUT') {
        result[name] = self.call
      } else {
        result[`${name}Refetch`] = self.call
      }

      return result
    }

    asyncSetState = async state => new Promise(res => this.setState(state, res))

    call = async ({ query, body } = {}) => {
      await this.asyncSetState({
        loading: true,
        error: null,
      })

      try {
        const progressHandler = (progressEvent) => {
          if (progressEvent.lengthComputable) {
            // eslint-disable-next-line max-len
            const percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total)

            console.log('percentCompleted ', percentCompleted)
            // this.setState({
            //   loading: percentCompleted,
            // })
          }
        }

        const data = await callApi[method.toLowerCase()](`${url}/${(query ? `?${Qs.stringify(query)}` : '')}`, {
          data: body,
          getCancelSource: source => this.apiInstance = source,
          onDownloadProgress: progressHandler,
          onUploadProgress: progressHandler,
        })

        setCachedData(data)

        await this.asyncSetState({
          data,
          loading: false,
          error: null,
        })

        return data
      } catch (data) {
        let { message } = data

        if (data.response && data.response.data && data.response.data.message) {
          // eslint-disable-next-line prefer-destructuring
          message = data.response.data.message
        }

        await this.asyncSetState({
          loading: false,
          error: message,
        })

        throw message
      }
    }

    render() {
      return (
        <Comp
          {...this.props}
          data={this.getData(this)}
        >
          {this.props.children}
        </Comp>
      )
    }
  }
}

export default api
