import * as d3 from 'd3'

// Import custom types
import {
    ISimpleAction,
} from '../types'

interface IPartitionState {
    data: any,
    loadedTime: number,
    loading: boolean,
}

const initialState: IPartitionState = {
    data: null,
    loadedTime: null,
    loading: false,
}

const reducer = (state = initialState, action: ISimpleAction): IPartitionState => {
    switch (action.type) {
        case 'LOADING_PARTITION':
            return {
                ...state,
                loading: true,
            }

        case 'FETCH_PARTITION_SUCCESS':
            return {
                ...state,
                data: action.payload.content,
                loadedTime: Date.now(),
                loading: false,
            }

        case 'FETCH_PARTITION_FAILURE':
            return {
                ...state,
                loading: false,
            }

        default:
            return state
    }
}

export default reducer
