import {combineReducers} from 'redux'

import sunburst from './sunburst'
import verification from './verification'

const mainReducer = combineReducers({
    sunburst,
    verification,
})

export default mainReducer
