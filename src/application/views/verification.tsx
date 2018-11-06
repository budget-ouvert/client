import * as React from 'react'
import {connect} from 'react-redux'

// Import custom actions
import {
    fetchPlfFile,
} from '../actions/sunburst'

// Import custom components

// Import custom types
import {
    IVerificationViewState,
} from '../types'

// Link redux state to current component's react props
// which will now be notified when changes occur in redux state
const reduxify = (mapReduxStateToReactProps: any, mapDispatchToProps?: any, mergeProps?: any, options?: any) => {
    return (target: any) => (connect(mapReduxStateToReactProps, mapDispatchToProps, mergeProps, options)(target) as any)
}

// Describe how redux state should be mapped to props
const mapReduxStateToReactProps = (state : IVerificationViewState): IVerificationViewState => {
    return state
}

@reduxify(mapReduxStateToReactProps)
export class Verification extends React.Component<IVerificationViewState, any> {
    public componentDidMount() {
        // TODO: should fetch data
    }

    public render () {
        let {
            dispatch,
        } = this.props

        return (
            <div id='application'>

            </div>
        )
    }
}
