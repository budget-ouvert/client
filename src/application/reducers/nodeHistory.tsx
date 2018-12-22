import * as d3 from 'd3'

// Import custom types
import {
    ISimpleAction,
} from '../types'

export interface INodeHistory {
    [year: string]: {
        ae?: number,
        cp?: number,
        codes: string[],
        distance: number,
        libelles: string[],
        selected?: boolean,
    }
}

interface INodeHistoryState {
    data: INodeHistory,
    loadedTime: number,
    loading: boolean,
}

const initialState: INodeHistoryState = {
    data: {},
    loadedTime: null,
    loading: false,
}

const reducer = (state = initialState, action: ISimpleAction): INodeHistoryState => {
    switch (action.type) {
        case 'LOADING_HISTORY':
            return {
                ...state,
                loading: true,
            }

        case 'FETCH_HISTORY_SUCCESS':
            return {
                ...state,
                data: action.payload,
                loading: false,
                loadedTime: Date.now(),
            }

        case 'FETCH_HISTORY_FAILURE':
            return {
                ...state,
                loading: false,
            }

        default:
            return state
    }
}

export default reducer
