import {combineReducers} from 'redux'

import * as d3 from 'd3'

// Import custom types
import {
    IMainViewState,
    ISimpleAction,
} from '../../types'

const initialState: IMainViewState = {
    selectedPath: null,
}

const reducer = (state = initialState, action: ISimpleAction): IMainViewState => {
    switch (action.type) {
        case 'CHANGED_SELECTED_POINT':
            return {
                ...state,
                selectedPath: action.payload,
            }

        default:
            return state
    }
}

export default reducer
