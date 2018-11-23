import * as React from 'react'
import {connect} from 'react-redux'

// Import custom actions
import {
    fetchPartition,
} from '../../components/partition/actions'
import {
    changeSelectedPoint,
} from './actions'

// Import custom components
import Partition from '../../components/partition'
import NodeViewer from '../../components/nodeViewer'

// Import custom types
import {
    IMainView,
    IReduxStore,
} from '../../types'

// Link redux state to current component's react props
// which will now be notified when changes occur in redux state
const reduxify = (mapReduxStateToReactProps: any, mapDispatchToProps?: any, mergeProps?: any, options?: any) => {
    return (target: any) => (
        connect(
            mapReduxStateToReactProps,
            mapDispatchToProps,
            mergeProps,
            options
        )(target) as any
    )
}

// Describe how redux state should be mapped to props
const mapReduxStateToReactProps = (state : IReduxStore): IMainView => {
    return {
        ...state.views.mainView,
        data: state.data,
        dispatch: state.dispatch,
    }
}

@reduxify(mapReduxStateToReactProps)
export default class MainView extends React.Component<IMainView, any> {
    public componentDidMount() {
        this.props.dispatch(fetchPartition('http://api.live.rollin.ovh/information_by_action/plf_2019.csv'))
    }

    public render () {
        let {
            data,
            dispatch,
            selectedPath,
        } = this.props

        return (
            <div id='partition-view'>
                <div>
                    <div id='node-viewer'>
                        <NodeViewer path={selectedPath} />
                    </div>
                    <Partition
                        data={data.partition.data}
                        loadedTime={data.partition.loadedTime}
                        onMouseOver={(p: any) => {
                            let path : string[] = [p.data.name]
                            let currentNode = p
                            while (currentNode.parent) {
                                path.push(currentNode.parent.data.name)
                                currentNode = currentNode.parent
                            }

                            this.props.dispatch(changeSelectedPoint(path.reverse()))
                        }}
                    />
                </div>
            </div>
        )
    }
}
