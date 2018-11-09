import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {
    Provider,
} from 'react-redux'
import {
    createStore,
    applyMiddleware,
    combineReducers,
} from 'redux'
import {
    createLogger,
} from 'redux-logger'

import './../style.less'
import Routes from './routes'
import middlewares from './middlewares/middlewares'
import mainReducer from './reducers/mainReducer'

// Redux initialisation
if (process.env.NODE_ENV === 'development') {
    // Log redux dispatch only in development
    middlewares.push(createLogger({}))
}
const finalCreateStore = applyMiddleware(...middlewares)(createStore)
const store = finalCreateStore(mainReducer)

ReactDOM.render(
    <Provider store={store}>
        <Routes />
    </Provider>,
    document.getElementById('application-wrapper')
);
