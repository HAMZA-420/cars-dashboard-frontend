import { applyMiddleware, combineReducers, createStore, compose } from 'redux'
import thunk from 'redux-thunk'
import {
  authReducer
} from '.'
import types from './types'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

const userFromStorage = localStorage.getItem('user')
  ? JSON.parse(localStorage.getItem('user'))
  : null

const initialState = {
  auth: {
    user: userFromStorage,
  },
}

const appReducer = combineReducers({
  auth: authReducer
})

const rootReducer = (state, action) => {
  if (action.type === types.USER_LOGOUT) {
    return appReducer(undefined, action)
  }

  return appReducer(state, action)
}

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(thunk))
)

export default store
