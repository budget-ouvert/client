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

export const updateSelectedNode = (code: string, path: string[], data: any): IAction => {
    return {
        type: 'UPDATE_SELECTED_NODE',
        payload: {
            code,
            path,
            data,
        }
    }
}

export const changeSource = (source: string): IAction => {
    return (dispatch: any, getState: any) => {
        const year = getState().views.mainView.year
        const toYear = INFO_BY_SOURCE_TYPE[source].years.indexOf(year) > 0 ?
            year :
            INFO_BY_SOURCE_TYPE[source].years[0]

        dispatch(updateSource(source))
        dispatch(changeYear(toYear))
    }
}

export const updateSource = (source: string): IAction => {
    return {
        type: 'UPDATE_SOURCE',
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

export const findSelectedNode = (source: string, year: string, code: string): IAction => {
    return (dispatch: any, getState: any) => {
        const root = getState().data.partition.byKey[`${source}-${year}`].data
        let queue = [root]
        let path: string[] = [root.name]

        while (queue.length > 0) {
            const node = queue.shift()

            if (node.code == code) {
                path.push(node.name)
                console.log(path)

                dispatch(updateSelectedNode(
                    code,
                    path,
                    {
                        ae: node.ae,
                        cp: node.cp,
                        size: node.size,
                    }
                ))
                return
            } else if (code.startsWith(node.code)) {
                path.push(node.name)
            }

            if (node.children) {
                queue = [...queue, ...node.children]
            }
        }
    }
}
