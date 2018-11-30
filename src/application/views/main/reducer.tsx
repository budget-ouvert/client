import {combineReducers} from 'redux'

import * as d3 from 'd3'

// Import custom types
import {
    ISimpleAction,
} from '../../types'

import {
    IMainViewState,
} from './index'

const initialState: IMainViewState = {
    selectedNode: {
        path: [],
        size: null,
    },
}

const reducer = (state = initialState, action: ISimpleAction): IMainViewState => {
    switch (action.type) {
        case 'CHANGED_SELECTED_POINT':
            return {
                ...state,
                selectedNode: {
                    path: action.payload.path,
                    size: action.payload.size,
                },
            }

        default:
            return state
    }
}

export default reducer
