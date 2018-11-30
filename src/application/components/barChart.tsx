import * as React from 'react'
import * as d3 from 'd3'
import * as _ from 'lodash'

interface IProps {
    data: any,
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
        this.width = document.getElementById(this.props.targetDivId).clientWidth
        this.height = document.getElementById(this.props.targetDivId).clientHeight
        if (this.state.data) {
            this.draw()
        }
    }

    public shouldComponentUpdate(nextProps: IProps, nextState: IState) {
        // If loaded time for input data is different,
        // then one should update this component.
        if (nextProps.loadedTime != this.props.loadedTime) {
            return true
        }

        return false
    }

    public componentDidUpdate() {
        this.clearDOM()
        this.draw()
    }

    public clearDOM() {
        const svg : any = d3.select(`#${this.props.targetDivId}`)
            .select('#local-container')
            .selectAll('g')
            .remove();
    }

    public draw() {
        const margin = ({top: 20, right: 0, bottom: 30, left: 40})
        const height = 150
        const width = 200

        const data = this.state.data

        const xAxis = (g: any) => {
            return g
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x)
                    .tickSizeOuter(0))
        }

        const yAxis = (g: any) => {
            return g.attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(y))
                .call((g: any) => g.select(".domain").remove())
        }

        const x = d3.scaleBand()
            .domain(data.map((d: any) => d.name))
            .range([margin.left, width - margin.right])
            .padding(0.1)

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, (d: any) => d.value) as any]).nice()
            .range([height - margin.bottom, margin.top])

        const svg = d3.select(`#${this.props.targetDivId}`)
            .select(`#local-container`)
            .style("width", `${this.width}px`)
            .style("height", `${this.height}px`)
            .style("overflow", "hidden")
            .style("font", "10px sans-serif");

        svg.append("g")
            .attr("fill", "#5C7080")
            .selectAll("rect").data(data).enter().append("rect")
                .attr("x", (d: any) => x(d.name))
                .attr("y", (d: any) => y(d.value))
                .attr("height", (d: any) => y(0) - y(d.value))
                .attr("width", x.bandwidth());

        svg.append("g")
            .call(xAxis);

        svg.append("g")
            .call(yAxis);
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
