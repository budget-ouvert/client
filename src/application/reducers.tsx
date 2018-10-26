import {
    action,
    appState,
} from './types'


const initialAppState: appState = {
    data: null,
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
