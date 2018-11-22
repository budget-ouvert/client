import * as React from 'react'
import {connect} from 'react-redux'

// Import custom actions
import {
    fetchPlfFile,
} from '../actions/sunburst'

// Import custom components
import Sunburst from '../components/sunburst'
import Partition from '../components/partition'
import DummyComponent from '../components/dummyComponent'

// Import custom types
import {
    ISunburstView,
} from '../types'

// Link redux state to current component's react props
// which will now be notified when changes occur in redux state
const reduxify = (mapReduxStateToReactProps: any, mapDispatchToProps?: any, mergeProps?: any, options?: any) => {
    return (target: any) => (connect(mapReduxStateToReactProps, mapDispatchToProps, mergeProps, options)(target) as any)
}

// Describe how redux state should be mapped to props
const mapReduxStateToReactProps = (state : ISunburstView): ISunburstView => {
    return state
}

@reduxify(mapReduxStateToReactProps)
export default class MainView extends React.Component<ISunburstView, any> {
    public componentDidMount() {
        this.props.dispatch(fetchPlfFile('http://api.live.rollin.ovh/cp/plf2017.csv'))
    }

    public render () {
        let {
            dispatch,
            sunburst,
        } = this.props

        return (
            <div id='partition-view'>
                <div className='flex'>
                    <Partition
                        data={sunburst.data}
                        dataLoadedTime={sunburst.dataLoadedTime}
                        dispatch={dispatch}
                    />
                    {/* <DummyComponent child={sunburst.selectedPath} /> */}
                </div>
            </div>
        )
    }
}
