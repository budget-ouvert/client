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
import * as qs from 'query-string'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import './style.less'

// Import custom actions
import {
    fetchPartition,
} from '../../actions/partition'
import {
    changeSource,
    changeYear,
    updateHierarchyType,
    updateSelectedNode,
    updateSource,
    updateYear,
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
    source: string,
    // Selected year
    // (ex: 2018)
    year: string,
}

export interface IProps extends IView, IMainViewState {}

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
const mapReduxStateToReactProps = (state : IReduxStore): IProps => {
    return {
        ...state.views.mainView,
        data: state.data,
        dispatch: state.dispatch,
    }
}

@reduxify(mapReduxStateToReactProps)
export default class MainView extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)

        const args = qs.parse(props.location.search)
        console.log(args)

        if (args.source && args.year) {
            console.log('dispatch')
            this.props.dispatch(updateYear(args.year as string))
            this.props.dispatch(changeSource(args.source as string))
        }

        this.state = {
            selectedTabId: args.tabId ? args.tabId as TabId : 'partition',
            shouldRedirect: false,
        }
    }

    public componentDidMount() {
        // this.props.dispatch(changeYear('2019'))
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
            source,
            year,
        } = this.props

        const partitionTab = <div id='partition'>
            {data.partition.loading || !(`${source}-${year}` in data.partition.byKey) ?
                <div className='centered-spinner'>
                    <Spinner/>
                </div> :
                <Partition
                    data={data.partition.byKey[`${source}-${year}`].data}
                    loadedTime={data.partition.byKey[`${source}-${year}`].loadedTime}
                    maxDepth={INFO_BY_SOURCE_TYPE[source].maxDepth}
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
            {data.partition.loading || !(`${source}-${year}` in data.partition.byKey) ?
                <div className='centered-spinner'>
                    <Spinner/>
                </div> :
                <TreeView
                    data={data.partition.byKey[`${source}-${year}`].data}
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
                            inputItem={source}
                            onChange={(target: string) => {
                                dispatch(changeSource(target))
                            }}
                        />
                        <StringSelect
                            disabled={!source}
                            items={source ?
                                INFO_BY_SOURCE_TYPE[source].years :
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
                            source != 'Recettes' ?
                                <BarChart
                                    data={selectedNode.data}
                                    loadedTime={(`${source}-${year}` in data.partition.byKey) ? data.partition.byKey[`${source}-${year}`].loadedTime : null}
                                    selectedNodePath={selectedNode.path}
                                    targetDivId={'barchart'}
                                /> :
                                null
                        }
                    </div>
                    <div id='path-breadcrumbs'>
                        <NodeViewer
                            label={INFO_BY_SOURCE_TYPE[source].label}
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
