import * as React from 'react'
import * as d3 from 'd3'
import * as _ from 'lodash'

interface IProps {
    data: any,
    loadedTime: number,
    // Codes for Type Mission, Mission, etc
    // (example: 1, AA, ...)
    selectedNodePath: string[],
    targetDivId: string,
}

interface IState {
    data: any,
    loadedTime: number,
}

export default class BarChart extends React.Component<IProps, IState> {
    width: number;
    height: number;

    public constructor(props: IProps) {
        super(props)
        this.state = {
            data: [],
            loadedTime: null,
        }
    }

    public static getDerivedStateFromProps(props: IProps, state: IState) {
        if (props.data) {
            const rows = d3.dsvFormat(';').parseRows(props.data)

            rowLoop:
            for (let i = 1; i < rows.length; i++) {
                // Skip first item since it's the root's title
                pathLoop:
                for (let k = 1; k < props.selectedNodePath.length; k++) {
                    if (props.selectedNodePath[k] != rows[i][2*(k-1)]) {
                        continue rowLoop
                    }
                }

                return {
                    data: [
                        {
                            name: "Autorisations d'engagement",
                            value: Number(rows[i][10]),
                        }, {
                            name: "Crédits de paiement",
                            value: Number(rows[i][11]),
                        }
                    ],
                    loadedTime: props.loadedTime,
                }
            }
        }

        return state
    }

    public componentDidMount() {
        this.width = document.getElementById(this.props.targetDivId).clientWidth
        this.height = document.getElementById(this.props.targetDivId).clientHeight
        if (this.state.data) {
            this.draw()
        }
    }

    public componentDidUpdate() {
        this.clearDOM()
        this.draw()
    }

    public clearDOM() {
        const svg : any = d3.select(`#${this.props.targetDivId}`)
            .select('#local-container')
            .selectAll('g')
            .remove()
    }

    public draw() {
        const margin = ({top: 20, right: 0, bottom: 30, left: 100})

        const data = this.state.data

        const x = d3.scaleBand()
            .domain(data.map((d: any) => d.name))
            .range([margin.left, this.width - margin.right])
            .padding(0.5)

        const xAxis = (g: any) => {
            return g
                .attr("transform", `translate(0,${this.height - margin.bottom})`)
                .call(d3.axisBottom(x)
                    .tickSizeOuter(0))
                .call((g: any) => g.select(".domain").remove())
        }

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, (d: any) => d.value) as any]).nice()
            .range([this.height - margin.bottom, margin.top])

        const yAxis = (g: any) => {
            return g.attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y).ticks(3))
                .call((g: any) => g.select(".domain").remove())
        }

        const svg = d3.select(`#${this.props.targetDivId}`)
            .select(`#local-container`)
            .style("width", `${this.width}px`)
            .style("height", `${this.height}px`)
            .style("overflow", "hidden")
            .style("font", "10px sans-serif")

        svg.append("g")
            .attr("fill", "#8A9BA8")
            .selectAll("rect").data(data).enter().append("rect")
                .attr("x", (d: any) => x(d.name))
                .attr("y", (d: any) => y(d.value))
                .attr("height", (d: any) => y(0) - y(d.value))
                .attr("width", x.bandwidth())

        svg.append("g")
            .call(xAxis)

        svg.append("g")
            .call(yAxis)
    }

    public render() {
        return (
            <div>
                <svg
                    ref='container'
                    id={'local-container'}
                >

                </svg>
            </div>
        )
    }
}
