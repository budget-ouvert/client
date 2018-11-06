import * as React from 'react'
import {connect} from 'react-redux'

// Import custom actions
import {
    updateSelectedYear,
} from '../actions/verification'

// Import custom components
import StringSelect from '../components/selects/stringSelect'

// Import custom types
import {
    IVerificationView,
} from '../types'

// Link redux state to current component's react props
// which will now be notified when changes occur in redux state
const reduxify = (mapReduxStateToReactProps: any, mapDispatchToProps?: any, mergeProps?: any, options?: any) => {
    return (target: any) => (connect(mapReduxStateToReactProps, mapDispatchToProps, mergeProps, options)(target) as any)
}

// Describe how redux state should be mapped to props
const mapReduxStateToReactProps = (state : IVerificationView): IVerificationView => {
    return state
}

@reduxify(mapReduxStateToReactProps)
export default class VerificationView extends React.Component<IVerificationView, any> {
    public componentDidMount() {
        // TODO: should fetch data
    }

    public render () {
        let {
            dispatch,
            verification,
        } = this.props

        let {
            selectedYear,
        } = verification

        return (
            <div id='application'>
                <StringSelect
                    inputItem={selectedYear}
                    items={['2012-2013', '2013-2014']}
                    icon={'column-layout'}
                    onChange={updateSelectedYear}
                    dispatch={dispatch}
                />
            </div>
        )
    }
}
