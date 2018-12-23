import {
    IAction,
} from '../../types'

import {
    fetchPartition,
} from '../../actions/partition'

import {
    fetchHistory,
} from '../../actions/nodeHistory'

import {
    INFO_BY_SOURCE_TYPE,
    ISelectedNode,
} from './index'

export const updateHierarchyType = (hierarchyType: string): IAction => {
    return {
        type: 'UPDATE_HIERARCHY_TYPE',
        payload: hierarchyType,
    }
}

export const updateYear = (year: string): IAction => {
    return {
        type: 'UPDATE_YEAR',
        payload: year,
    }
}

export const updateSource = (source: string): IAction => {
    return {
        type: 'UPDATE_SOURCE',
        payload: source,
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

export const changeSource = (source: string, history: any): IAction => {
    return (dispatch: any, getState: any) => {
        const year = getState().views.mainView.year
        const code = getState().views.mainView.selectedNode.code

        // If partition needs to be downloaded, fetch it;
        // otherwise, just update redux state.
        if (!(`${source}-${year}` in getState().data.partition.byKey)) {
            // Check year
            const currentYear = getState().views.mainView.year
            const toYear = INFO_BY_SOURCE_TYPE[source].years.indexOf(year) >= 0 ?
                year :
                INFO_BY_SOURCE_TYPE[source].years[INFO_BY_SOURCE_TYPE[source].years.length-1]
            if (currentYear != toYear) {
                dispatch(updateYear(toYear))
            }

            dispatch(fetchPartition(
                source,
                toYear,
                () => dispatch(updateToConsistentState(
                    source,
                    toYear,
                    {
                        code,
                        path: [],
                        data: {
                            ae: null,
                            cp: null,
                            size: null,
                        }
                    },
                    history,
                ))
            ))
        } else {
            dispatch(updateToConsistentState(
                source,
                year,
                {
                    code,
                    path: [],
                    data: {
                        ae: null,
                        cp: null,
                        size: null,
                    }
                },
                history,
            ))
        }
    }
}

export const changeYear = (year: string, history: any): IAction => {
    return (dispatch: any, getState: any) => {
        const source = getState().views.mainView.source
        const code = getState().views.mainView.selectedNode.code

        // If partition needs to be downloaded, fetch it;
        // otherwise, just update redux state.
        if (!(`${source}-${year}` in getState().data.partition.byKey)) {
            dispatch(fetchPartition(
                source,
                year,
                () => dispatch(updateToConsistentState(
                    source,
                    year,
                    {
                        code,
                        path: [],
                        data: {
                            ae: null,
                            cp: null,
                            size: null,
                        }
                    },
                    history,
                ))
            ))
        } else {
            dispatch(updateToConsistentState(
                source,
                year,
                {
                    code,
                    path: [],
                    data: {
                        ae: null,
                        cp: null,
                        size: null,
                    }
                },
                history,
            ))
        }
    }
}

export const updateToConsistentState = (source: string, year: string, selectedNode: ISelectedNode, history: any): IAction => {
    return (dispatch: any, getState: any) => {
        const currentSource = getState().views.mainView.source
        if (currentSource != source) {
            dispatch(updateSource(source))
        }

        // Check year
        const currentYear = getState().views.mainView.year
        const toYear = INFO_BY_SOURCE_TYPE[source].years.indexOf(year) >= 0 ?
            year :
            INFO_BY_SOURCE_TYPE[source].years[INFO_BY_SOURCE_TYPE[source].years.length-1]
        if (currentYear != toYear) {
            dispatch(updateYear(toYear))
        }

        // Check code
        let toCode = ''

        if (currentSource != source || currentYear != year) {
            const root = getState().data.partition.byKey[`${source}-${toYear}`].data
            let queue = [root]
            let path: string[] = [root.name]

            while (queue.length > 0) {
                const node = queue.shift()

                if (node.code == selectedNode.code) {
                    if (!(['PLF', 'REC'].indexOf(node.code) >= 0)) {
                        path.push(node.name)
                    }
                    toCode = node.code

                    dispatch(updateSelectedNode(
                        toCode,
                        path,
                        {
                            ae: node.ae,
                            cp: node.cp,
                            size: node.size,
                        }
                    ))
                    dispatch(fetchHistory(toYear, toCode))
                    break
                } else if (selectedNode.code.startsWith(node.code)) {
                    path.push(node.name)
                }

                if (node.children) {
                    queue = [...queue, ...node.children]
                }
            }

            if (toCode == '') {
                toCode = root.code
                // If no node was found
                dispatch(updateSelectedNode(
                    toCode,
                    [],
                    {
                        ae: root.ae,
                        cp: root.cp,
                        size: root.size,
                    }
                ))
                dispatch(fetchHistory(toYear, toCode))
            }
        } else {
            toCode = selectedNode.code
            dispatch(updateSelectedNode(
                toCode,
                selectedNode.path,
                {
                    ae: selectedNode.data.ae,
                    cp: selectedNode.data.cp,
                    size: selectedNode.data.size,
                }
            ))
            dispatch(fetchHistory(toYear, toCode))
        }

        // Update react-router history
        history.push({
            search: `?source=${source}&year=${year}&code=${toCode}`,
        })
    }
}
