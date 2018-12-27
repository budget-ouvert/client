import * as React from 'react'
import * as d3 from 'd3'
import * as _ from 'lodash'

interface IProps {
    data: any,
    loadedTime: number,
    maxDepth: number,
    onMouseOverCallback: any,
    selectedCode: string,
    targetDivId: string,
}

interface IState {
    data: any,
    loadedTime: number,
}

export default class Partition extends React.Component<IProps, IState> {
    static defautOpacity = 0.6
    static hoverOpacity = 0.75
    static colors = ["#CFF3D2", "#A6DEC5", "#83C7B9", "#65B0B0", "#4E97A9", "#3C7EA2", "#2D659D", "#1F4B99"].reverse()

    width: number;
    height: number;
    focus: any;
    root: any;
    cell: any;
    rect: any;
    text: any;
    rectHeight: any;
    labelVisible: any;

    public constructor(props: IProps) {
        super(props)
        this.state = {
            data: null,
            loadedTime: null,
        }
    }

    public static getDerivedStateFromProps(props: IProps, state: IState) {
        if (state.loadedTime != props.loadedTime) {
            return {
                data: props.data,
                loadedTime: props.loadedTime,
            }
        }

        return state
    }

    public componentDidMount() {
        this.width = document.getElementById(this.props.targetDivId).offsetWidth - 1
        this.height = document.getElementById(this.props.targetDivId).offsetHeight - 4
        if (this.state.data) {
            this.drawPartition()
        }
    }

    public shouldComponentUpdate(nextProps: IProps, nextState: IState) {
        // If loaded time for input data is different,
        // then one should update this component.
        if (nextProps.loadedTime != this.props.loadedTime) {
            return true
        }

        // Change focus to selected node
        let p = null
        this.root.each((d: any) => {
            if(d.data.code == nextProps.selectedCode) {
                p = d
            }
        })

        if (p) {
            this.changeFocus(this, p)
        }

        return false
    }

    public componentDidUpdate() {
        this.clearPartition()
        this.drawPartition()
    }

    public clearPartition() {
        const svg : any = d3.select(`#${this.props.targetDivId}`)
            .select('#local-container')
            .select('#partition')
            .select('g')
            .remove()
    }

    public changeFocus = (that: any, p: any) => {
        that.focus = p

        that.root.each((d : any) => d.target = {
            x0: (d.x0 - p.x0) / (p.x1 - p.x0) * this.height,
            x1: (d.x1 - p.x0) / (p.x1 - p.x0) * this.height,
            y0: d.y0 - p.y0,
            y1: d.y1 - p.y0
        })

        const t = that.cell.transition().duration(750)
            .attr("transform", (d : any) => `translate(${d.target.y0 + (that.focus.depth == 0 ? 0 : 50)},${d.target.x0})`)

        that.rect.transition(t)
            .attr("height", (d : any) => that.rectHeight(d.target))

        that.text.transition(t)
            .attr("fill-opacity", (d : any) => +that.labelVisible(d.target))
    }

    public drawPartition() {
        function clicked(that: any, p: any) {
            that.changeFocus(that, p)
            that.props.onMouseOverCallback(p)
        }

        function getPath(node: any): string[] {
            if (node.parent) {
                return [...getPath(node.parent), node.data.name]
            } else {
                return [node.data.name]
            }
        }

        function onMouseOver(that: any, p: any) {
            const nodePath = getPath(p)

            d3.select(this)
                .select('rect')
                .attr("fill-opacity", Partition.hoverOpacity)

            svg.selectAll("g")
                .filter((node:any) => {
                    // First check that parent is correct (this fortunately allows to
                    // distinguish between nodes which have the same name but not the same
                    // path ; it is not sustainable for complex trees though).
                    const correctParent = (node && node.parent) ? (nodePath.indexOf(node.parent.data.name) == node.depth-1) : true

                    return (node && node.data) ? (correctParent && nodePath.indexOf(node.data.name) == node.depth) : false
                })
                .select('rect')
                    .style("fill-opacity", Partition.hoverOpacity)
                    .style("outline-width", "1px")

            d3.select('#tooltip')
                .attr('opacity', 0.9)
        }

        function onMouseLeave(that: any, p: any) {
            const nodePath = getPath(p)

            d3.select(this)
                .select('rect')
                .attr("fill-opacity", Partition.defautOpacity)

            svg.selectAll("g")
                .filter((node:any) => {
                    return (node && node.data) ? (nodePath.indexOf(node.data.name) == node.depth) : false
                })
                .select('rect')
                    .style("fill-opacity", Partition.defautOpacity)
                    .style("outline-width", "0px")

            d3.select('#tooltip')
                .attr('opacity', 0)
        }

        function onMouseMove(that: any, p: any) {
            const m = d3.mouse(this)

            const tooltip = d3.select('#tooltip')

            tooltip.select('#tooltip-name')
                .text(p.data.name)
                .call(_.partial(wrap, that))

            tooltip.select('#tooltip-number')
                .text((`${d3.format(",d")(p.data.size).replace(/,/g, ' ')} euros`))

            const node = d3.select('#tooltip').select('text').node() as any
            const bbox = node.getBBox()
            const padding = 8

            d3.select('#tooltip')
                .select('rect')
                .attr("x", bbox.x - padding)
                .attr("y", bbox.y - padding)
                .attr("width", bbox.width + (padding*2))
                .attr("height", bbox.height + (padding*2))
                .style("fill", "#293742")

            tooltip
                .attr("transform", `translate(${(p.target ? p.target.y0 - 30 : p.y0 - 30) + m[0] - bbox.width}, ${(p.target ? p.target.x0 : p.x0) + m[1] - 20})`)
        }

        function wrap(that: any, texts: any) {
            let width = that.width / 4
            // TODO: investigate why function() {} and () => {}
            // don't yield the same value for `this`...
            texts.each(function() {
                // console.log(d3.select(this as any))
                let text = d3.select(this as any),
                    words = text.text().split(/\s+/).reverse(),
                    word,
                    line: any= [],
                    lineNumber = 0,
                    lineHeight = 1.1, // ems
                    y = text.attr('y'),
                    x = text.attr('x'),
                    dy = isNaN(parseFloat(text.attr('dy'))) ? 0.2 : parseFloat(text.attr('dy')),
                    tspan = text
                        .text(null)
                            .append('tspan')
                                .attr('x', x)
                                .attr('y', y)
                                .attr('dy', dy + 'em')

                while (word = words.pop()) {
                    line.push(word)
                    tspan.text(line.join(' '))
                    var node: any = tspan.node()
                    var hasGreaterWidth = node.getComputedTextLength() > width
                    if (hasGreaterWidth) {
                        line.pop()
                        tspan.text(line.join(' '))
                        line = [word]
                        tspan = text
                            .append('tspan')
                            .attr('x', x)
                            .attr('y', y)
                            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
                            .text(word)
                    }
                }
            })
        }

        this.rectHeight = (d : any) => {
            return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2)
        }

        this.labelVisible = (d : any) => {
            return d.y1 <= this.width && d.y0 >= 0 && d.x1 - d.x0 > 16
        }

        let data = this.state.data

        let partition : any = (data: any) => {
            const root : any = d3.hierarchy(data)
                .each((d: any) => {
                    d.value = d.data.size
                })
                .sort((a: any, b: any) => b.value - a.value);

            // La size donne les dimensions de l'espace de projection.
            // Ici, on multiplie la largeur par
            // 2 = maxdepth / 3
            // car je veux voir 2 colonnes s'afficher.
            return d3.partition().size([this.height, this.props.maxDepth / 3 * (this.width - 100)])(root)
        }

        let color : any = d3.scaleOrdinal()
            .range(d3.quantize(d3.interpolateViridis, data.children.length + 1))

        let format : any = d3.format(",d")

        this.root = partition(data)
        this.focus = this.root

        const svg = d3.select(`#${this.props.targetDivId}`)
            .select('#local-container')
            .style("width", `${this.width}px`)
            .style("height", `${this.height}px`)
            .style("overflow", "hidden")
            .style("font", "10px sans-serif")
            .select('#partition')

        this.cell = svg.append("g")
            .selectAll("g")
            .data(this.root.descendants())
            .enter().append("g")
                .attr("transform", (d: any) => `translate(${d.y0},${d.x0})`)
                .on("mouseover", _.partial(onMouseOver, this))
                .on("mouseleave", _.partial(onMouseLeave, this))
                .on("mousemove", _.partial(onMouseMove, this))

        const tooltip = d3.select('#tooltip')
            .attr('opacity', 0)

        tooltip.select('text')
            .attr('fill', '#F5F8FA')
            .attr('font-size', '16')
            .attr('pointer-events', 'none')

        tooltip.select('#tooltip-number')
            .attr('font-size', '13')
            .attr('font-style', 'italic')

        this.rect = this.cell.append("rect")
            .attr("width", (d : any) => d.y1 - d.y0 - 1)
            .attr("height", (d : any) => this.rectHeight(d))
            .attr("fill-opacity", Partition.defautOpacity)
            .attr("fill", (d : any) => {
                return Partition.colors[d.depth]
            })
            .style("cursor", "pointer")
            .style("outline-color", "#10161A")
            .style("outline-style", "solid")
            .style("outline-width", "0px")
            .style("outline-offset", "-2px")
            .on("click", _.partial(clicked, this))

        this.text = this.cell.append("text")
            .style("user-select", "none")
            .attr("pointer-events", "none")
            .attr("x", 4)
            .attr("y", 13)
            .attr("fill-opacity", (d : any) => +this.labelVisible(d))
            .text((d : any) => d.data.name)
            .call(_.partial(wrap, this))
    }

    public render() {
        return (
            <div>
                <svg
                    ref='container'
                    id={'local-container'}
                >
                    <g id='partition'></g>
                    <g id='tooltip'>
                        <rect></rect>
                        <text>
                            <tspan id='tooltip-name' x="0" dy="1.2em"></tspan>
                            <tspan id='tooltip-number' x="0" dy="1.2em"></tspan>
                        </text>
                    </g>
                </svg>
            </div>
        )
    }
}
