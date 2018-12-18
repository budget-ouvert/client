import {
    Classes,
    Icon,
    ITreeNode,
    Position,
    Tooltip,
    Tree,
} from '@blueprintjs/core'
import * as React from 'react'

interface INodeData {
    ae: number,
    cp: number,
}

interface IProps {
    data: any,
}

interface IState {
    isBroken: boolean,
    nodes: ITreeNode<INodeData>[],
    renderData: any,
}

export default class TreeView extends React.Component<IProps, IState> {
    static id: number = 0;

    constructor(props: IProps) {
        super(props);
        this.state = {
            isBroken: false,
            nodes: [],
            renderData: null,
        }
    }

    static getId = (): number => {
        TreeView.id++
        return TreeView.id
    }

    private static breadFirstSearchInputColumn = (node: any) => {
        if (node.inputColumns && node.inputColumns.length > 0) {
            return true
        } else if (node.attributes && node.attributes.length > 0) {
            return node.attributes.some((attribute: any) => {
                return TreeView.breadFirstSearchInputColumn(attribute)
            })
        } else {
            return false
        }
    }

    private static genObjNodes = (node: any): ITreeNode<INodeData> => {
        const hasChildren = (node.children && node.children.length > 0)

        return {
            childNodes: hasChildren ? node.children.map((child: any) => {
                return TreeView.genObjNodes(child)
            }).sort((a: any, b: any) => b.nodeData.cp - a.nodeData.cp) : null,
            hasCaret: hasChildren,
            icon: hasChildren ? 'folder-open' : 'tag',
            id: TreeView.getId(),
            isExpanded: false,
            isSelected: false,
            label: <div>{node.name}</div>,
            nodeData: {
                ae: node.ae,
                cp: node.cp,
            },
            secondaryLabel: <span>{node.cp}</span>,
        }
    }

    static getDerivedStateFromProps(props: IProps, state: IState): IState {
        if (props.data !== state.renderData) {
            try {
                let nodes = [TreeView.genObjNodes(props.data)]
                console.log(nodes)

                return {
                    nodes: nodes,
                    renderData: props.data,
                    isBroken: false,
                }
            } catch(err) {
                console.log(err)
                return {
                    nodes: [] as any,
                    renderData: props.data,
                    isBroken: true,
                }
            }
        } else {
            return state
        }
    }

    private forEachNode(nodes: ITreeNode<INodeData>[], callback: (node: ITreeNode<INodeData>) => void) {
        if (nodes == null) {
            return;
        }

        for (const node of nodes) {
            callback(node);
            this.forEachNode(node.childNodes, callback);
        }
    }

    private handleNodeClick = (nodeData: ITreeNode<INodeData>, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
        console.log('click')
        const originallySelected = nodeData.isSelected;
        if (!e.shiftKey) {
            this.forEachNode(this.state.nodes, (n: any) => (n.isSelected = false));
        }
        nodeData.isSelected = originallySelected == null ? true : !originallySelected;
        this.setState(this.state);
    }

    private handleNodeCollapse = (node: ITreeNode<INodeData>) => {
        console.log('collapse')
        node.isExpanded = false;
        this.setState(this.state);
    }

    private handleNodeExpand = (node: ITreeNode<INodeData>) => {
        node.isExpanded = true;
        this.setState(this.state);
    }

    public render = () => {
        return <Tree
            className={Classes.ELEVATION_0}
            contents={this.state.nodes}
            onNodeClick={this.handleNodeClick}
            onNodeCollapse={this.handleNodeCollapse}
            onNodeExpand={this.handleNodeExpand}
        />
    }
}
