import {
    action,
    appState,
} from './types'

import {sunburstTestData} from './mockdata/mockData'

const initialAppState: appState = {
    data: sunburstTestData,
}

export function reducer(state = initialAppState, action: action): appState {
    switch (action.type) {
        // case 'CHANGE_CURRENT_TREE_NODE':
        //     return {
        //         ...state,
        //         currentTreeNodePath: action.value,
        //     }

        default:
            return state
    }
}
