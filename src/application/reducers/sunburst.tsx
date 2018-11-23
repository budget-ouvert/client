import * as d3 from 'd3'

// Import custom types
import {
    simpleAction,
    ISunburstState,
} from '../types'

const initialState: ISunburstState = {
    data: null,
    dataLoadedTime: Date.now(),
    selectedPath: null,
}

const sunburst = (state = initialState, action: simpleAction): ISunburstState => {
    switch (action.type) {
        case 'CHANGED_SUNBURST_POINT':
            return {
                ...state,
                selectedPath: action.payload,
            }

        case 'SUCCESS_FETCH_PLF_FILE':
            // Turn incoming CSV file into a javascript object
            // that will later on be used by our partition component.
            // This function expects a CSV file with a header, and 10 columns
            let rows = d3.dsvFormat(';').parseRows(action.payload.content)

            // Create root node
            let root : any = {
                'name': 'PLF',
                'children': [] as any,
            }

            // Iterate through lines (skip the first one as it's a header)
            for (let i = 1; i < rows.length; i++) {
                // Get numeric information
                // (dans le cas du PLF, ce qui nous intéresse ce sont
                // les crédits de paiement)
                const size = +rows[i][9]
                if (isNaN(size)) {
                    continue
                }

                // Get node path
                const path = [
                    rows[i][0],
                    rows[i][2],
                    rows[i][4],
                    rows[i][6]
                ]

                // One starts from the root node, and for each
                // element of the current node's path,
                // one makes sure that this node exists.
                let currentNode = root

                for (let j = 0; j < path.length; j++) {
                    let children = currentNode['children']
                    let nodeName = path[j]
                    let childNode

                    // If j is not at "action"-level, then
                    // continue checking of nodes do exist...
                    if (j + 1 < path.length) {
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
                    // ... otherwise create it as one is sure it doesn't exist.
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

export default sunburst
