import * as d3 from 'd3'
import {combineReducers} from 'redux'

// Import custom types
import {
    ISimpleAction,
} from '../../types'

import {
    IMainViewState,
} from './index'

const initialState: IMainViewState = {
    hierarchyType: 'Comptabilité générale',
    selectedNode: {
        path: [],
        data: {
            ae: null,
            cp: null,
            size: null,
        },
    },
    source: 'PLF',
    year: '2019',
}

const reducer = (state = initialState, action: ISimpleAction): IMainViewState => {
    switch (action.type) {
        case 'UPDATE_SELECTED_NODE':
            return {
                ...state,
                selectedNode: {
                    path: action.payload.path,
                    data: action.payload.data,
                },
            }

        case 'UPDATE_HIERARCHY_TYPE':
            return {
                ...state,
                hierarchyType: action.payload,
            }

        case 'UPDATE_SOURCE':
            return {
                ...state,
                source: action.payload,
            }

        case 'UPDATE_YEAR':
            return {
                ...state,
                year: action.payload,
            }

        default:
            return state
    }
}

export default reducer
