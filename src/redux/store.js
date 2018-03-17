import { createStore, applyMiddleware } from 'redux'
import { persistStore } from 'redux-persist'
import socketMiddleware from './middlewares/socket'
import reducers from './reducers'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'

const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(
    thunk,
    socketMiddleware
  ))
)

persistStore(store)

export default store
