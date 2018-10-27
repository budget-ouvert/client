import {
    action,
    appState,
} from './types'

import {sunburstTestData} from './mockdata/mockData'

const initialAppState: appState = {
    data: sunburstTestData,
    selectedPath: null,
}

export function reducer(state = initialAppState, action: action): appState {
    switch (action.type) {
        case 'CHANGED_SUNBURST_POINT':
            return {
                ...state,
                selectedPath: action.value,
            }

        default:
            return state
    }
}
