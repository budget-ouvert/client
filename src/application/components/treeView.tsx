import {
    Classes,
    Icon,
    ITreeNode,
    Position,
    Text,
    Tooltip,
    Tree,
} from '@blueprintjs/core'
import * as d3 from 'd3'
import * as React from 'react'

interface INodeData {
    code: string,
    ae: number,
    cp: number,
    size: number,
}

interface IProps {
    data: any,
    onClickCallback: any,
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
        let format : any = d3.format(",d")

        return {
            childNodes: hasChildren ? node.children.map((child: any) => {
                return TreeView.genObjNodes(child)
            }).sort((a: any, b: any) => b.nodeData.size - a.nodeData.size) : null,
            hasCaret: hasChildren,
            icon: hasChildren ? 'folder-open' : 'tag',
            id: TreeView.getId(),
            isExpanded: false,
            isSelected: false,
            label: <Text ellipsize={true}>{node.name}</Text>,
            nodeData: {
                code: node.code,
                ae: node.ae,
                cp: node.cp,
                size: node.size,
            },
            secondaryLabel: <Text ellipsize={true}>{format(node.size).replace(/,/g, ' ')} euros</Text>,
        }
    }

    static getDerivedStateFromProps(props: IProps, state: IState): IState {
        if (props.data !== state.renderData) {
            try {
                let nodes = [TreeView.genObjNodes(props.data)]

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

    private getPath = (nodePath: number[]): string[] => {
        let path: string[] = []

        let currentNode = this.props.data
        path.push(currentNode.name)
        nodePath.shift()

        nodePath.forEach((i: number) => {
            currentNode = currentNode.children.sort((a: any, b: any) => b.size - a.size)[i]
            path.push(currentNode.name)
        })

        return path
    }

    private handleNodeClick = (node: ITreeNode<INodeData>, _nodePath: number[], e: React.MouseEvent<HTMLElement>) => {
        const originallySelected = node.isSelected;
        if (!e.shiftKey) {
            this.forEachNode(this.state.nodes, (n: any) => (n.isSelected = false));
        }
        node.isSelected = true;

        // Set new redux state
        this.props.onClickCallback({
            ...node.nodeData,
            path: this.getPath(_nodePath),
        })

        // Set new component state
        this.setState(this.state, () => node.hasCaret ?
            (node.isExpanded ?
                this.handleNodeCollapse(node) :
                this.handleNodeExpand(node)
            ) :
            null
        )
    }

    private handleNodeCollapse = (node: ITreeNode<INodeData>) => {
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
