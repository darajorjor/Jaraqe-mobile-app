/* eslint-disable no-shadow,react/no-unused-state */
import React from 'react'
import Qs from 'qs'
import { connect } from 'react-redux'
import { setToStore } from './redux'
import ApiCaller from '../ApiCaller'

const callApi = new ApiCaller()

const api = (ops, additionalConfig) => {
  let name = ops.name
  if (additionalConfig && additionalConfig.name) {
    name = additionalConfig.name
  }

  return (Comp) => {
    @connect(
      state => ({
        [name]: state.ApiHOC.root[name],
      }),
      { setToStore },
      null,
      { withRef: true, }
    )
    class ApiHOC extends React.Component {
      constructor(props) {
        super(props)

        let url, method, name, query, options

        if (typeof ops === 'function') {
          const data = Object.assign({}, ops(props), additionalConfig)
          url = data.url
          method = data.method
          name = data.name
          query = data.query
          options = data.options || { instantCall: true, caching: true }
        } else {
          url = ops.url
          method = ops.method
          name = ops.name
          query = ops.query
          options = ops.options || { instantCall: true, caching: true }
        }

        method = method.toUpperCase()

        this.url = url
        this.method = method
        this.name = name
        this.query = query
        this.options = options

        this.apiInstance = null
        this.state = {
          loading: false,
          error: null,
          data: null,
        }
      }

      componentDidMount() {
        this.call = this.call.bind(this.call)

        if (this.method === 'GET' && this.options.instantCall) {
          this.call({ query: this.query })
        }
      }

      componentWillUnmount() {
        if (this.apiInstance) {
          this.apiInstance.cancel()
        }
      }

      getData = (self) => {
        const { loading, error } = self.state
        const { [this.name]: data } = self.props

        const result = Object.assign({}, self.props.data, {
          [`${this.name}Loading`]: loading,
          [`${this.name}Error`]: error,
          [this.name]: data,
        })

        if (this.method === 'POST' || this.method === 'PUT') {
          result[this.name] = self.call
        } else {
          result[`${this.name}Refetch`] = self.call
        }

        console.log(`PROPS: ${JSON.stringify(result)}`)
        return result
      }

      asyncSetState = async state => new Promise(res => this.setState(state, res))

      call = async ({ query, body } = {}) => {
        const { setToStore } = this.props

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

          const { data } = await callApi[this.method.toLowerCase()](`${this.url}/${((query || this.query) ? `?${Qs.stringify((query || this.query))}` : '')}`, {
            data: body,
            getCancelSource: source => this.apiInstance = source,
            onDownloadProgress: progressHandler,
            onUploadProgress: progressHandler,
          })

          if (this.options.caching) {
            setToStore(`${this.name}`, data)
          }

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

      getWrappedInstance() {
        return this.refInstance
      }

      render() {
        return (
          <Comp
            ref={ref => this.refInstance = ref}
            {...this.props}
            data={this.getData(this)}
          >
            {this.props.children}
          </Comp>
        )
      }
    }

    return ApiHOC
  }}

export default api
