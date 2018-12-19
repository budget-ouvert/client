import {
    Button,
    ControlGroup,
    Spinner,
    Tab,
    TabId,
    Tabs,
    Tag,
} from '@blueprintjs/core'
import * as React from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import './style.less'

// Import custom actions
import {
    fetchPartition,
} from '../../actions/partition'
import {
    changeSourceType,
    changeYear,
    updateHierarchyType,
    updateSelectedNode,
} from './actions'

// Import custom components
import BarChart from '../../components/barChart'
import BetaHeader from '../../components/betaHeader'
import NodeViewer from '../../components/nodeViewer'
import Partition from '../../components/partition'
import StringSelect from '../../components/selects/stringSelect'
import TreeView from '../../components/treeView'

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
        data: {
            ae: number,
            cp: number,
            size: number,
        },
    },
    // Source document type
    // (ex: PLF, LFI, LR)
    sourceType: string,
    // Selected year
    // (ex: 2018)
    year: string,
}

export interface IMainView extends IView, IMainViewState {}

export const INFO_BY_SOURCE_TYPE: {[source: string]: any} = {
    'Recettes': {
        years: ['2018', '2019'],
        maxDepth: 4,
        label: 'Montant',
    },
    'PLF': {
        years: ['2017', '2018', '2019'],
        maxDepth: 6,
        label: 'Crédits de paiement',
    }
}

export interface IState {
    selectedTabId: TabId,
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
            selectedTabId: 'partition',
            shouldRedirect: false,
        }
    }

    public componentDidMount() {
        this.props.dispatch(changeYear('2019'))
        console.log('Un(e) dev ici ? Écris-nous, on a des choses à te montrer : contact@arkhn.org')
    }

    private handleTabChange = (navbarTabId: TabId) => this.setState({
        selectedTabId: navbarTabId,
    })

    public render () {
        let {
            data,
            dispatch,
            hierarchyType,
            selectedNode,
            sourceType,
            year,
        } = this.props

        const partitionTab = <div id='partition'>
            {data.partition.loading || !(`${sourceType}-${year}` in data.partition.byKey) ?
                <div className='centered-spinner'>
                    <Spinner/>
                </div> :
                <Partition
                    data={data.partition.byKey[`${sourceType}-${year}`].data}
                    loadedTime={data.partition.byKey[`${sourceType}-${year}`].loadedTime}
                    maxDepth={INFO_BY_SOURCE_TYPE[sourceType].maxDepth}
                    onMouseOverCallback={(p: any) => {
                        let path : string[] = [p.data.name]
                        let currentNode = p
                        while (currentNode.parent) {
                            path.push(currentNode.parent.data.name)
                            currentNode = currentNode.parent
                        }

                        dispatch(updateSelectedNode(path.reverse(), {
                            ae: p.data.ae,
                            cp: p.data.cp,
                            size: p.data.size,
                        }))
                    }}
                    targetDivId={'partition'}
                />
            }
        </div>

        const listTab = <div id='tree'>
            {data.partition.loading || !(`${sourceType}-${year}` in data.partition.byKey) ?
                <div className='centered-spinner'>
                    <Spinner/>
                </div> :
                <TreeView
                    data={data.partition.byKey[`${sourceType}-${year}`].data}
                    onClickCallback={(nodeData: any) => {
                        console.log(nodeData)
                        dispatch(updateSelectedNode(nodeData.path, {
                            ae: nodeData.ae,
                            cp: nodeData.cp,
                            size: nodeData.size,
                        }))
                    }}
                />
            }
        </div>

        return (
            <div id='main-view-container'>
                <BetaHeader />
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
                            items={['Recettes', 'PLF']}
                            inputItem={sourceType}
                            onChange={(target: string) => {
                                dispatch(changeSourceType(target))
                            }}
                        />
                        <StringSelect
                            disabled={!sourceType}
                            items={sourceType ?
                                INFO_BY_SOURCE_TYPE[sourceType].years :
                                []
                            }
                            inputItem={year}
                            onChange={(target: string) => {
                                dispatch(changeYear(target))
                            }}
                        />
                    </ControlGroup>
                    <Button
                        icon={'help'}
                        minimal={true}
                        onClick={() => this.setState({shouldRedirect: true,})}
                    >
                        Informations
                    </Button>
                </div>
                <div id='node-viewer'>
                    <div id='barchart'>
                        {
                            sourceType != 'Recettes' ?
                                <BarChart
                                    data={selectedNode.data}
                                    loadedTime={(`${sourceType}-${year}` in data.partition.byKey) ? data.partition.byKey[`${sourceType}-${year}`].loadedTime : null}
                                    selectedNodePath={selectedNode.path}
                                    targetDivId={'barchart'}
                                /> :
                                null
                        }
                    </div>
                    <div id='path-breadcrumbs'>
                        <NodeViewer
                            label={INFO_BY_SOURCE_TYPE[sourceType].label}
                            path={selectedNode.path}
                            size={selectedNode.data.size}
                        />
                    </div>
                </div>
                <div id='information-viewer'>
                    <Tabs
                        onChange={this.handleTabChange}
                        renderActiveTabPanelOnly={true}
                        selectedTabId={this.state.selectedTabId}
                    >
                        <Tab
                            id="partition"
                            title="Visualisation proportionelle au montant"
                            panel={partitionTab}
                        />
                        <Tab
                            id="tree"
                            title="Visualisation par liste"
                            panel={listTab}
                        />
                    </Tabs>
                </div>
            </div>
        )
    }
}
