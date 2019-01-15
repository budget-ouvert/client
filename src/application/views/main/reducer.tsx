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
        code: null,
        path: [],
        data: {
            ae: null,
            cp: null,
            size: null,
        },
        sizes: [],
    },
    source: null,
    year: null,
}

const reducer = (state = initialState, action: ISimpleAction): IMainViewState => {
    switch (action.type) {
        case 'UPDATE_SELECTED_NODE':
            return {
                ...state,
                selectedNode: {
                    code: action.payload.code,
                    path: action.payload.path,
                    data: action.payload.data,
                    sizes: action.payload.sizes,
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
                selectedNode: {
                    code: null,
                    path: [],
                    data: {
                        ae: null,
                        cp: null,
                        size: null,
                    },
                    sizes: [],
                },
            }

        case 'UPDATE_YEAR':
            return {
                ...state,
                year: action.payload,
                selectedNode: {
                    code: null,
                    path: [],
                    data: {
                        ae: null,
                        cp: null,
                        size: null,
                    },
                    sizes: [],
                },
            }

        default:
            return state
    }
}

export default reducer
