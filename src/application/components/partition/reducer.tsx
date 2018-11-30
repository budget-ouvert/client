import * as d3 from 'd3'

// Import custom types
import {
    ISimpleAction,
} from '../../types'

interface IPartitionState {
    data: any,
    loadedTime: number,
    loading: boolean,
}

const initialState: IPartitionState = {
    data: null,
    loadedTime: Date.now(),
    loading: false,
}

const reducer = (state = initialState, action: ISimpleAction): IPartitionState => {
    switch (action.type) {
        case 'LOADING_PARTITION':
            return {
                ...state,
                loading: true,
            }

        case 'FETCH_PARTITION_SUCCESS':
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
                const size = +rows[i][11]
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

                // If sous-action exists, add it
                if (rows[i][8] != '') {
                    path.push(rows[i][8])
                }

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
                loadedTime: Date.now(),
                loading: false,
            }

        case 'FETCH_PARTITION_FAILURE':
            return {
                ...state,
                loading: false,
            }

        default:
            return state
    }
}

export default reducer
