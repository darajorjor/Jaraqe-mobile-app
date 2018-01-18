import { createStore } from 'redux'
import { persistStore } from 'redux-persist'
import reducers from './reducers'

const store = createStore(reducers)

persistStore(store)

export default store
