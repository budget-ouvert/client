import {
    Navbar,
    Button,
    Alignment,
    ControlGroup,
    FormGroup,
    MenuItem,
} from '@blueprintjs/core'
import {
    Select,
    ItemPredicate,
    ItemRenderer,
} from '@blueprintjs/select'
import * as React from 'react'
import {Route} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import {connect} from 'react-redux'

// Import custom actions
import {
    fetchPlfFile,
} from '../actions/sunburst'

// Import custom components
import {Sunburst} from '../components/sunburst'
import {DummyComponent} from '../components/dummyComponent'

// Import custom types
import {
    IAppState,
} from '../types'

// Link redux state to current component's react props
// which will now be notified when changes occur in redux state
const reduxify = (mapReduxStateToReactProps: any, mapDispatchToProps?: any, mergeProps?: any, options?: any) => {
    return (target: any) => (connect(mapReduxStateToReactProps, mapDispatchToProps, mergeProps, options)(target) as any)
}

// Describe how redux state should be mapped to props
const mapReduxStateToReactProps = (state : IAppState): IAppState => {
    return state
}

@reduxify(mapReduxStateToReactProps)
export class Main extends React.Component<IAppState, any> {
    public componentDidMount() {
        this.props.dispatch(fetchPlfFile('http://api.live.rollin.ovh/cp/plf2017.csv'))
    }

    public render () {
        let {
            dispatch,
            sunburst,
        } = this.props

        return (
            <div id='application'>
                <Sunburst
                    data={sunburst.data}
                    dataLoadedTime={sunburst.dataLoadedTime}
                    dispatch={dispatch}
                />
                <DummyComponent child={sunburst.selectedPath} />
            </div>
        )
    }
}
