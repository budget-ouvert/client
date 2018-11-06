import * as d3 from 'd3'

// Import mock data
import {
    sunburstTestData,
} from '../mockdata/sunburst'

// Import custom types
import {
    action,
    ISunburstState,
} from '../types'

const initialState: ISunburstState = {
    data: sunburstTestData,
    dataLoadedTime: Date.now(),
    selectedPath: null,
}

export function sunburst(state = initialState, action: action): ISunburstState {
    switch (action.type) {
        case 'CHANGED_SUNBURST_POINT':
            return {
                ...state,
                selectedPath: action.payload,
            }

        case 'SUCCESS_FETCH_PLF_FILE':
            // Turn incoming CSV file into a javascript object
            // that will later on be used by our sunburst component.
            let csv = d3.dsvFormat(';').parseRows(action.payload.content)

            let root : any = {
                'name': 'PLF',
                'children': [] as any,
            }

            for (let i = 0; i < csv.length; i++) {
                let sequence = csv[i][0]
                let size = (csv[i].length > 1) ? (+csv[i][1]) : 1
                if (isNaN(size)) {
                    continue
                }

                let parts = sequence.split('|')
                let currentNode = root
                for (let j = 0; j < parts.length; j++) {
                    let children = currentNode['children']
                    let nodeName = parts[j]
                    let childNode
                    if (j + 1 < parts.length) {
                        let foundChild = false

                        for (let k = 0; k < children.length; k++) {
                            if (children[k]['name'] == nodeName) {
                                childNode = children[k]
                                foundChild = true
                                break
                            }
                        }

                        if (!foundChild) {
                            childNode = {
                                'name': nodeName,
                                'children': [],
                            }
                            children.push(childNode)
                        }

                        currentNode = childNode
                    } else {
                        childNode = {
                            'name': nodeName,
                            'size': size,
                        }
                        children.push(childNode)
                    }
                }
            }

            return {
                ...state,
                data: root,
                dataLoadedTime: Date.now(),
            }

        case 'FAILED_FETCH':
            return state

        default:
            return state
    }
}
