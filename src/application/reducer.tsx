// This app has only one store.
// It is divided in views, each of which has it's own reducers and actions.

import {combineReducers} from 'redux'

import partition from './components/partition/reducer'

const dataReducer = combineReducers({
    partition,
})

import mainView from './views/main/reducer'
import verificationView from './views/main/reducer'

const viewsReducer = combineReducers({
    mainView,
    verificationView,
})

const mainReducer = combineReducers({
    data: dataReducer,
    views: viewsReducer,
})

export default mainReducer
