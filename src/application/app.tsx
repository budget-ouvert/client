import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
    Provider,
} from 'react-redux'
import {
    applyMiddleware,
    combineReducers,
    createStore,
} from 'redux'
import {
    createLogger,
} from 'redux-logger'

import './main.less'
import Routes from './routes'
import middlewares from './middlewares'
// import mainReducer from './reducers/mainReducer'
import reducer from './reducers'

// Redux initialisation
if (process.env.NODE_ENV === 'development') {
    // Log redux dispatch only in development
    middlewares.push(createLogger({}))
}
const store = applyMiddleware(...middlewares)(createStore)(reducer)

ReactDOM.render(
    <Provider store={store}>
        <Routes />
    </Provider>,
    document.getElementById('application-wrapper')
)
