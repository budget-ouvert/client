import {
    IAction,
} from '../../types'

import {
    fetchPartition,
} from '../../actions/partition'

import {
    INFO_BY_SOURCE_TYPE,
} from './index'

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

export const changesource = (source: string): IAction => {
    return (dispatch: any, getState: any) => {
        const year = getState().views.mainView.year
        const toYear = INFO_BY_SOURCE_TYPE[source].years.indexOf(year) > 0 ?
            year :
            INFO_BY_SOURCE_TYPE[source].years[0]

        dispatch(updatesource(source))
        dispatch(changeYear(toYear))
    }
}

export const updatesource = (source: string): IAction => {
    return {
        type: 'UPDATE_SOURCE_TYPE',
        payload: source,
    }
}

export const changeYear = (year: string): IAction => {
    return (dispatch: any, getState: any) => {
        const source = getState().views.mainView.source
        // If year needs to be downloaded, fetch it;
        // otherwise, just update year in redux state.
        if (!(`${source}-${year}` in getState().data.partition.byKey)) {
            dispatch(fetchPartition(
                source,
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
