import * as React from 'react'
import * as d3 from 'd3'
import * as _ from 'lodash'

import {
    clickedSunburstPoint,
} from '../actions/sunburst'

interface IProps {
    data: any;
    dataLoadedTime: number;
    dispatch: any;
}

interface IState {

}

export default class Sunburst extends React.Component<IProps, IState> {
    width: number;

    constructor(props: IProps) {
        super(props)
        this.width = 932
    }

    public componentDidMount() {
        console.log('componentDidMount')
        this.drawSunburst()
    }

    public shouldComponentUpdate(nextProps: IProps, nextState: IState) {
        console.log('shouldComponentUpdate')

        // If loaded time for input data is different,
        // then one should update this component.
        if (nextProps.dataLoadedTime != this.props.dataLoadedTime) {
            return true
        }

        return false
    }

    public componentDidUpdate() {
        this.clearSunburst()
        this.drawSunburst()
    }

    public clearSunburst() {
        const svg : any = d3.select('#container')
            .select('g')
            .remove();
    }

    public drawSunburst() {
        console.log('drawSunburst');

        let data = this.props.data;

        let partition: any = (data: any) => {
            const root : any = d3.hierarchy(data)
                .sum((d : any) => d.size)
                .sort((a: any, b: any) => b.value - a.value);
            return d3.partition().size([2 * Math.PI, root.height + 1])(root);
        }

        let color : any = d3.scaleOrdinal()
            .range(d3.quantize(d3.interpolateRainbow, data.children.length + 1))

        let format : any = d3.format(",d")

        let width : any = this.width

        let radius : any = width / 6

        let arc : any = d3.arc()
            .startAngle((d : any) => d.x0)
            .endAngle((d : any) => d.x1)
            .padAngle((d : any) => Math.min((d.x1 - d.x0) / 2, 0.005))
            .padRadius(radius * 1)
            .innerRadius((d : any) => d.y0 * radius)
            .outerRadius((d : any) => Math.max(d.y0 * radius, d.y1 * radius - 1));

        const root = partition(data);

        root.each((d : any) => d.current = d);

        const svg : any = d3.select('#container')
            .style("font", "10px sans-serif");

        const g : any = svg.append("g")
            .attr("transform", `translate(${width / 2},${width / 2})`);

        const path : any = g.append("g")
            .selectAll("path")
            .data(root.descendants().slice(1))
                .enter().append("path")
                .attr("fill", (d : any) => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
                .attr("fill-opacity", (d : any) => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
                .attr("d", (d : any) => arc(d.current));

        path.filter((d : any) => d.children)
            .style("cursor", "pointer")
            .on("click", _.partial(clicked, this));

        // Handles tooltip text (when hovering sunburst nodes)
        path.append("title")
            .text((d : any) => `${d.ancestors().reverse().slice(1).map((d : any) => d.data.name).join("/")}\n${format(d.value)}`);

        const label = g.append("g")
                .attr("pointer-events", "none")
                .attr("text-anchor", "middle")
                .style("user-select", "none")
            .selectAll("text")
            .data(root.descendants().slice(1))
            .enter().append("text")
                .attr("dy", "0.35em")
                .attr("fill-opacity", (d : any) => +labelVisible(d.current))
                .attr("transform", (d : any) => labelTransform(d.current))
                .text((d : any) => d.data.name);

        const parent = g.append("circle")
            .datum(root)
            .attr("r", radius)
            .attr("fill", "none")
            .attr("pointer-events", "all")
            .on("click", _.partial(clicked, this));

        function clicked(that: any, p : any) {
            parent.datum(p.parent || root);

            root.each((d : any) => d.target = {
                x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
                y0: Math.max(0, d.y0 - p.depth),
                y1: Math.max(0, d.y1 - p.depth)
            });

            const t : any = g.transition().duration(750);

            // Transition the data on all arcs, even the ones that aren’t visible,
            // so that if this transition is interrupted, entering arcs will start
            // the next transition from the desired position.
            path.transition(t)
                .filter((d: any) : any => {
                    return +this.getAttribute("fill-opacity") || arcVisible(d.current) || arcVisible(d.target);
                })
                .tween("data", (d: any) => {
                    const i = d3.interpolate(d.current, d.target);
                    return (t : any) => d.current = i(t);
                })
                .attr("fill-opacity", (d : any) => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
                .attrTween("d", (d : any) => () => arc(d.current));

            label.filter((d:any) : any => {
                    return +this.getAttribute("fill-opacity") || labelVisible(d.current) || labelVisible(d.target);
                }).transition(t)
                .attr("fill-opacity", (d : any) => +labelVisible(d.target))
                .attrTween("transform", (d : any) => () => labelTransform(d.current));

            that.props.dispatch(clickedSunburstPoint(p));
        }

        function arcVisible(d : any) : any {
            return d.y1 <= 3 && d.y0 >= 0 && d.x1 > d.x0;
        }

        function labelVisible(d : any) : any {
            return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
        }

        function labelTransform(d : any) : any {
            const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
            const y = (d.y0 + d.y1) / 2 * radius;
            return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
        }
    }

    public render() {
        console.log('render');

        return (
            <div>
                <svg
                    ref='container'
                    width={this.width}
                    height={this.width}
                    className={'sunburst'}
                    id={'container'}
                >

                </svg>
            </div>
        )
    }
}
