import {
    Button,
    ControlGroup,
    Spinner,
    Tag,
} from '@blueprintjs/core'
import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import './style.less'

// Import custom actions
import {
    fetchPartition,
} from '../../actions/plf'
import {
    updateHierarchyType,
    updateSelectedNode,
    updateSourceType,
    updateYear,
} from './actions'

// Import custom components
import NodeViewer from '../../components/nodeViewer'
import Partition from '../../components/partition'
import BarChart from '../../components/barChart'
import StringSelect from '../../components/selects/stringSelect'

// Import custom types
import {
    IReduxStore,
    IView,
} from '../../types'

export interface IMainViewState {
    // Hierarchy type
    // (ex: comptabilité générale, compatabilité budgétaire)
    hierarchyType: string,
    // Clicked node in the visible partition
    selectedNode: {
        path: string[],
        size: number,
    },
    // Source document type
    // (ex: PLF, LFI, LR)
    sourceType: string,
    // Selected year
    // (ex: 2018)
    year: string,
}

export interface IMainView extends IView, IMainViewState {}

export interface IState {
    shouldRedirect: boolean,
}

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
export default class MainView extends React.Component<IMainView, IState> {
    constructor(props: IMainView) {
        super(props)
        this.state = {
            shouldRedirect: false,
        }
    }
    public componentDidMount() {
        this.props.dispatch(fetchPartition('http://api.live.rollin.ovh/information_by_action/plf_2019.csv'))
    }

    public render () {
        let {
            data,
            dispatch,
            hierarchyType,
            selectedNode,
            sourceType,
            year,
        } = this.props

        return (
            <div id='main-view-container'>
                {this.state.shouldRedirect ? <Redirect to='/' /> : null}
                <div id='header' className={'bp3-dark'}>
                    <div></div>
                    <ControlGroup>
                        <StringSelect
                            disabled={true}
                            items={['Comptabilité générale', 'Comptabilité budgétaire']}
                            inputItem={hierarchyType}
                            onChange={null}
                        />
                        <StringSelect
                            items={['PLF']}
                            inputItem={sourceType}
                            onChange={(target: string) => {
                                dispatch(updateSourceType(target))
                            }}
                        />
                        <StringSelect
                            items={['2019']}
                            inputItem={year}
                            onChange={(target: string) => {
                                dispatch(updateYear(target))
                            }}
                        />
                    </ControlGroup>
                    <Button
                        icon={'help'}
                        minimal={true}
                        onClick={() => this.setState({shouldRedirect: true,})}
                    />
                </div>
                <div id='node-viewer'>
                    <div id='path-breadcrumbs'>
                        <NodeViewer
                            path={selectedNode.path}
                            size={selectedNode.size}
                        />
                    </div>
                    <div id='barchart'>
                        <BarChart
                            data={data.plf.data}
                            loadedTime={data.plf.loadedTime}
                            selectedNodePath={selectedNode.path}
                            targetDivId={'barchart'}
                        />
                    </div>
                </div>
                <div id='partition-viewer'>
                    <div id='partition'>
                        {data.plf.loading ?
                            <div className='centered-spinner'>
                                <Spinner/>
                            </div> :
                            <Partition
                                data={data.plf.data}
                                loadedTime={data.plf.loadedTime}
                                onMouseOverCallback={(p: any) => {
                                    let path : string[] = [p.data.name]
                                    let currentNode = p
                                    while (currentNode.parent) {
                                        path.push(currentNode.parent.data.name)
                                        currentNode = currentNode.parent
                                    }

                                    this.props.dispatch(updateSelectedNode(path.reverse(), p.value))
                                }}
                                targetDivId={'partition'}
                            />
                        }
                    </div>
                </div>
            </div>
        )
    }
}
