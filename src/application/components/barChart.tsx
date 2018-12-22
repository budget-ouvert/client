import * as React from 'react'
import * as d3 from 'd3'
import * as _ from 'lodash'

import {
    INodeHistory,
} from '../reducers/nodeHistory'

interface IProps {
    data: INodeHistory,
    loadedTime: number,
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
            let data: any = []
            for (let year in props.data) {
                data.push({
                    name: `AE ${year}`,
                    color: "#BFCCD6",
                    value: props.data[year].ae ? props.data[year].ae : 0,
                })

                data.push({
                    name: `CP ${year}`,
                    color: "#BFCCD6",
                    value: props.data[year].cp ? props.data[year].cp : 0,
                })
            }

            return {
                data: data,
                loadedTime: props.loadedTime,
            }
        }

        return state
    }

    public componentDidMount() {
        this.width = document.getElementById(this.props.targetDivId).clientWidth - 20
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
                .call(d3.axisBottom(x).tickSizeOuter(0))
                .select(".domain")
                    .style("stroke", "#8A9BA8")
        }

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, (d: any) => d.value ? d.value : 0) as any]).nice()
            .range([this.height - margin.bottom, margin.top])

        const yAxis = (g: any) => {
            return g.attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y).ticks(3))
                .select(".domain")
                    .style("stroke", "#8A9BA8")
        }

        const svg = d3.select(`#${this.props.targetDivId}`)
            .select(`#local-container`)
            .style("width", `${this.width}px`)
            .style("height", `${this.height}px`)
            .style("overflow", "hidden")
            .style("font", "10px sans-serif")

        svg.append("g")
            .selectAll("rect").data(data).enter().append("rect")
                .attr("fill", (d: any) => d.color)
                .attr("x", (d: any) => x(d.name))
                .attr("y", (d: any) => y(d.value ? d.value : 0))
                .attr("height", (d: any) => y(0) - y(d.value ? d.value : 0))
                .attr("width", x.bandwidth())

        svg.append("g")
            .call(xAxis)

        svg.append("g")
            .call(yAxis)
    }

    public render() {
        return (
            <svg
                ref='container'
                id={'local-container'}
            >

            </svg>
        )
    }
}
