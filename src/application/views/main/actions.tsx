import {
    IAction,
} from '../../types'

import {
    fetchPartition,
} from '../../actions/plf'

export const updateHierarchyType = (hierarchyType: string): IAction => {
    return {
        type: 'UPDATE_HIERARCHY_TYPE',
        payload: hierarchyType,
    }
}

export const updateSelectedNode = (path: any, data: any): IAction => {
    return {
        type: 'UPDATE_SELECTED_NODE',
        payload: {
            path,
            data,
        }
    }
}

export const updateSourceType = (sourceType: string): IAction => {
    return {
        type: 'UPDATE_SOURCE_TYPE',
        payload: sourceType,
    }
}

export const changeYear = (year: string): IAction => {
    return (dispatch: any, getState: any) => {
        // If year needs to be downloaded, fetch it;
        // otherwise, just update year in redux state.
        if (!(year in getState().data.plf.plfByYear)) {
            dispatch(fetchPartition(
                year,
                () => dispatch(updateYear(year))
            ))
        } else {
            dispatch(updateYear(year))
        }
    }
}

export const updateYear = (year: string): IAction => {
    return {
        type: 'UPDATE_YEAR',
        payload: year,
    }
}
