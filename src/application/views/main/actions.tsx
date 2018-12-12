import {
    IAction,
} from '../../types'

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

export const updateYear = (year: string): IAction => {
    return {
        type: 'UPDATE_YEAR',
        payload: year,
    }
}
