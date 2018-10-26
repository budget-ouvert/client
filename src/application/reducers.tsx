import {
    action,
    appState,
} from './types'

import {sunburstTestData, selectedPathData} from './mockdata/mockData'

const initialAppState: appState = {
    data: sunburstTestData,
    selectedPath: selectedPathData,
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
