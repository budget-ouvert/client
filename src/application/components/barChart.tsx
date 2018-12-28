import * as React from 'react'
import * as d3 from 'd3'
import * as _ from 'lodash'

import {
    INodeHistory,
} from '../reducers/nodeHistory'

interface IProps {
    data: INodeHistory,
    labels: {[key: string]: string},
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

            if (props.data != null) {
                for (let year in props.data) {
                    let grouped_year: any = {
                        data: {},
                        year,
                        selected: props.data[year].selected,
                    }

                    for (let key in props.labels) {
                        grouped_year.data[key] = props.data[year].data[key] ?
                            props.data[year].data[key] :
                            0
                    }

                    data.push(grouped_year)
                }
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
        const svg = d3.select(`#${this.props.targetDivId}`)
            .select(`#local-container`)
            .style("width", `${this.width}px`)
            .style("height", `${this.height}px`)
            .style("overflow", "hidden")
            .style("font", "10px sans-serif")

        const margin = {top: 20, right: 20, bottom: 30, left: 50}
        const width = this.width - margin.left - margin.right
        const height = this.height - margin.top - margin.bottom
        const g = svg.append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`)

        const x0 = d3.scaleBand()
            .rangeRound([0, width])
            .paddingInner(0.2)
            .paddingOuter(0.5)

        const x1 = d3.scaleBand()
            .padding(0.3)

        const y = d3.scaleLinear()
            .rangeRound([height, 0])

        const z = d3.scaleOrdinal()
            .range(["#BFCCD6", "#8A9BA8", "#5C7080"])

        const data = this.state.data

        const keys: string[] = this.props.labels ?
            Object.keys(this.props.labels) :
            []
        const labels = this.props.labels

        x0.domain(data.map((d: any) => d.year))
        x1.domain(keys).rangeRound([0, x0.bandwidth()])
        y.domain([0, 1.2 * d3.max(data, (d: any) => d3.max(keys, (key: any) => d.data[key] as number))])
            .nice()

        if (data.length == 0) {
            return
        }

        const isSelected = (year: string) => {
            let r = false
            data.forEach((d: any) => {
                if (d.selected && d.year == year) {
                    r = true
                }
            })
            return r
        }

        g.append('g')
            .selectAll('line')
            .data(y.ticks(5).slice(1, 6))
            .enter()
                .append('line')
                .attr('x1', '0')
                .attr('x2', width)
                .attr('y1', y)
                .attr('y2', y)
                .attr('stroke', '#A7B6C2')
                .attr('stroke-width', '1px')
                .attr('stroke-dasharray', '6,6')

        const bars = g.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
                .attr("transform", (d: any) => `translate(${x0(d.year)},0)`)
            .selectAll("rect")
            .data((d: any) => keys.map((key: any) => {
                return {key: key, value: d.data[key], year: d.year}
            }))

        bars.enter().append("rect")
                .attr("x", (d: any) => x1(d.key))
                .attr("y", (d: any) => y(d.value))
                .attr("width", x1.bandwidth())
                .attr("height", (d: any) => height - y(d.value))
                .attr("fill", (d: any): string => z(d.key) as string)

        bars.enter().append('text')
            .text((d: any): string => d3.format('.4s')(d.value))
            .attr("x", (d: any) => x1(d.key) + x1.bandwidth() / 2)
            .attr("y", (d: any) => y(d.value) - 5)
            .attr('text-anchor', 'middle')
            .attr('font-size', '14px')
            .attr('font-weight', (d: any) => isSelected(d.year) ? '800' : '400')

        g.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x0))
            .selectAll('text')
            .attr('class', 'axis')
            .attr('font-size', '14px')
            .attr('font-weight', (y: string) => isSelected(y) ? '800' : '400')

        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(5, "s"))
            .append("text")
                .attr("x", 2)
                .attr("y", y(y.ticks().pop()) + 0.5)
                .attr("dy", "0.32em")
                .attr("fill", "#000")
                .attr("font-weight", "bold")
                .attr('font-size', '14px')
                .attr("text-anchor", "start")
                .text("Euros")

        const legend = g.append("g")
            .attr("font-family", "sans-serif")
            .attr("font-size", 10)
            .attr("text-anchor", "end")
            .selectAll("g")
            .data(keys.slice().reverse())
            .enter().append("g")
                .attr("transform", (d: any, i: number) => `translate(0,${i * 20})`)

        legend.append("rect")
            .attr("x", width - 19)
            .attr("width", 19)
            .attr("height", 19)
            .attr("fill", (k: any): string => z(k) as string)

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .attr('font-size', '14px')
            .text((k: any) => labels[k])
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
