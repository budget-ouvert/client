import {
    Breadcrumb,
    Button,
    ControlGroup,
    Icon,
    Spinner,
    Tag,
} from '@blueprintjs/core'
import * as React from 'react'
import {connect} from 'react-redux'
import {
    TransitionGroup,
    CSSTransition,
} from 'react-transition-group'

// Import custom actions
import {
    changeSelectedYear,
    downvoteCurrentSuggestion,
    nextSuggestion,
    previousSuggestion,
    upvoteCurrentSuggestion,
    upvoteSuggestionNextNeighbour,
} from '../actions/verification'

// Import custom components
import StringSelect from '../components/selects/stringSelect'
import PlfPath from '../components/plfPath'

// Import mock data
import {
    inputNode,
    saleNode,
} from '../mockdata/verification'

// Import custom types
import {
    IVerificationView,
    ISuggestionTarget,
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
        this.props.dispatch(changeSelectedYear('2017'))

        document.addEventListener("keydown", this.handleKeyPress, false)
    }

    public componentWillUnmount(){
        document.removeEventListener("keydown", this.handleKeyPress, false)
    }

    public handleKeyPress = (event: any) => {
        console.log(event.key)
        switch (event.key) {
            case 'ArrowRight':
                this.props.dispatch(nextSuggestion('next'))
                break

            case 'ArrowLeft':
                this.props.dispatch(previousSuggestion())
                break

            case 'ArrowDown':
                this.props.dispatch(downvoteCurrentSuggestion())
                break

            case 'ArrowUp':
                this.props.dispatch(upvoteCurrentSuggestion())
                break

            default:
                return
        }
    }

    private clickPreviousSuggestion = () => {
        this.props.dispatch(previousSuggestion())
    }

    private clickDownvoteSuggestion = () => {
        this.props.dispatch(downvoteCurrentSuggestion())
    }

    private clickUpvoteSuggestionNextNeighbour = () => {
        this.props.dispatch(upvoteSuggestionNextNeighbour())
    }

    private clickUpvoteSuggestion = () => {
        this.props.dispatch(upvoteCurrentSuggestion())
    }

    private clickNextSuggestion = () => {
        this.props.dispatch(nextSuggestion('next'))
    }

    public render () {
        const {
            dispatch,
            verification,
        } = this.props

        const {
            loading,
            sourceExit,
            targetExit,
            availableYears,
            currentSuggestion,
            selectedYear,
            suggestionList,
            sourcePlf,
            targetPlf,
        } = verification

        const sourceNodePath = sourcePlf && suggestionList.length > 0 ? sourcePlf[suggestionList[currentSuggestion].source_id] : null

        // The following lines could be usefull in case one wishes
        // to display several suggestions at the same time.

        // const targetNodePaths = targetPlf && suggestionList.length > 0 && suggestionList[currentSuggestion].targets.length > 0 ? suggestionList[currentSuggestion].targets.map((target: ISuggestionTarget) => {
        //     return targetPlf[target.target_id]
        // }) : []

        const targetNodePath = targetPlf && suggestionList.length > 0 && suggestionList[currentSuggestion].targets.length > 0 ? targetPlf[suggestionList[currentSuggestion].targets[0].target_id] : null

        const targetDistance = targetPlf && suggestionList.length > 0 && suggestionList[currentSuggestion].targets.length > 0 ? suggestionList[currentSuggestion].targets[0].distance : null

        console.log(suggestionList.length > 0 ? suggestionList[currentSuggestion].targets : null)

        return loading ?
            <div id='centered-spinner'>
                <Spinner />
            </div> :
            <div id='main-verification-container'>
                <StringSelect
                    inputItem={selectedYear}
                    items={availableYears}
                    icon={'calendar'}
                    onChange={changeSelectedYear}
                    dispatch={dispatch}
                />
                <ControlGroup id='choice-buttons'>
                    <Button
                        icon={'chevron-left'}
                        onClick={this.clickPreviousSuggestion}
                    />
                    <Button
                        icon={'cross'}
                        intent={'danger'}
                        onClick={this.clickDownvoteSuggestion}
                    />
                    <Button
                        icon={'tick'}
                        intent={'primary'}
                        onClick={this.clickUpvoteSuggestionNextNeighbour}
                    />
                    <Button
                        icon={'endorsed'}
                        intent={'success'}
                        onClick={this.clickUpvoteSuggestion}
                    />
                    <Button
                        icon={'chevron-right'}
                        onClick={this.clickNextSuggestion}
                    />
                </ControlGroup>
                <div className='input-columns'>
                    <div className='year'>{selectedYear}</div>
                    <div className='plf-paths'>
                        <TransitionGroup
                            // Allows to change classNames before
                            // component is unmounted
                            childFactory={(child: any): any => {
                                return React.cloneElement(child, {
                                    classNames: {
                                        enter: 'plf-path-enter',
                                        enterActive: 'plf-path-enter-active',
                                        exit: `${sourceExit}-exit`,
                                        exitActive: `${sourceExit}-exit-active`,
                                    }
                                })
                            }}
                        >
                            {[sourceNodePath].map((item: any) => {
                                return <CSSTransition
                                    key={item}
                                    timeout={300}
                                    classNames={{
                                        enter: 'plf-path-enter',
                                        enterActive: 'plf-path-enter-active',
                                        exit: `${sourceExit}-exit`,
                                        exitActive: `${sourceExit}-exit-active`,
                                    }}
                                >
                                    <PlfPath
                                        path={item}
                                    />
                                </CSSTransition>
                            })}
                        </TransitionGroup>
                    </div>
                </div>
                <div>
                    {
                        targetDistance ?
                            <Tag
                                large={true}
                                intent={
                                    targetDistance > 3 ?
                                        'danger' :
                                        (
                                            targetDistance > 2 ?
                                                'warning' :
                                                'none'
                                        )
                                }
                            >
                                Distance : {Math.round(100 * targetDistance) / 100}
                            </Tag> :
                            null
                    }
                </div>
                <Icon className='linking-arrow' icon='arrow-down' />
                <div className='input-columns'>
                    <div className='year'>{Number(selectedYear) + 1}</div>
                    <div className='plf-paths'>
                        <TransitionGroup
                            childFactory={(child: any): any => {
                                return React.cloneElement(child, {
                                    classNames: {
                                        enter: 'plf-path-enter',
                                        enterActive: 'plf-path-enter-active',
                                        exit: `${targetExit}-exit`,
                                        exitActive: `${targetExit}-exit-active`,
                                    }
                                })
                            }}
                        >
                            {[targetNodePath].map((item: any) => {
                                return <CSSTransition
                                    key={item}
                                    timeout={300}
                                    classNames={{
                                        enter: 'plf-path-enter',
                                        enterActive: 'plf-path-enter-active',
                                        exit: `${targetExit}-exit`,
                                        exitActive: `${targetExit}-exit-active`,
                                    }}
                                >
                                    <PlfPath
                                        path={item}
                                    />
                                </CSSTransition>
                            })}
                        </TransitionGroup>
                    </div>
                </div>
            </div>
    }
}
