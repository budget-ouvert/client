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
                    year,
                    ae: props.data[year].ae,
                    cp: props.data[year].cp,
                    selected: props.data[year].selected,
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
        const svg = d3.select(`#${this.props.targetDivId}`)
            .select(`#local-container`)
            .style("width", `${this.width}px`)
            .style("height", `${this.height}px`)
            .style("overflow", "hidden")
            .style("font", "10px sans-serif")

        const margin = {top: 20, right: 20, bottom: 30, left: 50}
        const width = this.width - margin.left - margin.right
        const height = this.height - margin.top - margin.bottom
        const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`)

        const x0 = d3.scaleBand()
            .rangeRound([0, width])
            .paddingInner(0.2)
            .paddingOuter(0.1)

        const x1 = d3.scaleBand()
            .padding(0.3)

        const y = d3.scaleLinear()
            .rangeRound([height, 0])

        const z = d3.scaleOrdinal()
            .range(["#BFCCD6", "#8A9BA8", "#5C7080"])

        const data = this.state.data

        const keys = ['ae', 'cp']
        const labels: {[key: string]: string} = {
            'ae': 'Autorisations d\'engagement',
            'cp': 'Crédits de paiement'
        }

        x0.domain(data.map((d: any) => d.year))
        x1.domain(keys).rangeRound([0, x0.bandwidth()])
        y.domain([0, d3.max(data, (d: any) => d3.max(keys, (key: any) => d[key] as number))])
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

        g.append("g")
            .selectAll("g")
            .data(data)
            .enter().append("g")
                .attr("transform", (d: any) => `translate(${x0(d.year)},0)`)
            .selectAll("rect")
            .data((d: any) => keys.map((key: any) => {
                return {key: key, value: d[key]}
            }))
            .enter().append("rect")
                .attr("x", (d: any) => x1(d.key))
                .attr("y", (d: any) => {
                    return y(d.value)
                })
                .attr("width", x1.bandwidth())
                .attr("height", (d: any) => height - y(d.value))
                .attr("fill", (d: any): string => z(d.key) as string)

        g.append("g")
            .attr("class", "axis")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x0))
            .selectAll('text')
            .attr('class', (y: string) => isSelected(y) ? 'selected' : '')

        g.append("g")
            .attr("class", "axis")
            .call(d3.axisLeft(y).ticks(null, "s"))
            .append("text")
                .attr("x", 2)
                .attr("y", y(y.ticks().pop()) + 0.5)
                .attr("dy", "0.32em")
                .attr("fill", "#000")
                .attr("font-weight", "bold")
                .attr("text-anchor", "start")
                .text("Montant")

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
