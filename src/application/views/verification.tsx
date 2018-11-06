import {
    Breadcrumb,
    Button,
    ControlGroup,
    Icon,
} from '@blueprintjs/core'
import * as React from 'react'
import {connect} from 'react-redux'

// Import custom actions
import {
    updateSelectedYear,
} from '../actions/verification'

// Import custom components
import StringSelect from '../components/selects/stringSelect'

// Import mock data
import {
    inputNode,
    saleNode,
} from '../mockdata/verification'

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
        this.props.dispatch(updateSelectedYear('2012'))
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
                <div id='main-verification-container'>
                    <StringSelect
                        inputItem={selectedYear}
                        items={['2012', '2013']}
                        icon={'column-layout'}
                        onChange={updateSelectedYear}
                        dispatch={dispatch}
                    />
                    <ControlGroup id='choice-buttons'>
                        <Button icon={'cross'} intent={'danger'} />
                        <Button icon={'tick'} intent={'success'} />
                    </ControlGroup>
                    <div className='input-columns'>
                        <div className='year'>{selectedYear}</div>
                        <div className='nodes'>
                            <div>
                                <ul className='bp3-breadcrumbs'>
                                    {saleNode.map((s: string, index: number) =>
                                        <li key={index}><Breadcrumb text={s} /></li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <Icon icon='arrow-down' />
                    <div className='input-columns'>
                        <div className='year'>{Number(selectedYear) + 1}</div>
                        <div className='nodes'>
                            <div>
                                <ul className='bp3-breadcrumbs'>
                                    {saleNode.map((s: string, index: number) =>
                                        <li key={index}><Breadcrumb text={s} /></li>
                                    )}
                                </ul>
                            </div>
                            <div>
                                <ul className='bp3-breadcrumbs'>
                                    {saleNode.map((s: string, index: number) =>
                                        <li key={index}><Breadcrumb text={s} /></li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
