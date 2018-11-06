// Import mock data


// Import custom types
import {
    simpleAction,
    IVerificationState,
} from '../types'

const initialState: IVerificationState = {
    selectedYear: null,
}

const verification = (state = initialState, action: simpleAction): IVerificationState => {
    switch (action.type) {
        case 'UPDATE_SELECTED_YEAR':
            return {
                ...state,
                selectedYear: action.payload,
            }

        default:
            return state
    }
}

export default verification
