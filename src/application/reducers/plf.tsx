import * as d3 from 'd3'

// Import custom types
import {
    ISimpleAction,
} from '../types'

interface IPartitionState {
    plfByYear: {
        [year: string] : {
            loadedTime: number,
            data: any,
        }
    },
    loading: boolean,
}

const initialState: IPartitionState = {
    plfByYear: {},
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
                plfByYear: {
                    ...state.plfByYear,
                    [action.payload.year]: {
                        data: JSON.parse(action.payload.content),
                        loadedTime: Date.now(),
                    },
                },
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
