import storage from 'redux-persist/lib/storage'
import { persistCombineReducers, createTransform } from 'redux-persist'
import Main from './Main.reducer'

const loadingTransform = createTransform(
  (inboundState) => {
    Object.keys(inboundState).map(key => {
      if (key.toLowerCase().includes('loading')) {
        inboundState[key] = false
      }

      return null
    })

    return inboundState
  },
  (outboundState) => outboundState,
)

const persistConfig = {
  key: 'root',
  storage,
  transforms: [
    loadingTransform, // refreshes all loadings
  ],
}

const appReducer = persistCombineReducers(persistConfig, {
  Main,
})

export default appReducer
