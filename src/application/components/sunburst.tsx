import * as React from 'react'
import * as d3 from 'd3'

interface Props {
    data: any;
}

interface State {

}

export class Sunburst extends React.Component<Props, State> {
    public componentDidMount() {
        console.log('componentDidMount')
        this.drawSunburst()
    }

    public drawSunburst() {
        console.log('here');
        let {data} = this.props;

        let partition: any = (data: any) => {
            const root : any = d3.hierarchy(data)
                .sum((d : any) => d.size)
                .sort((a: any, b: any) => b.value - a.value);
            return d3.partition()
                .size([2 * Math.PI, root.height + 1])
              (root);
        }

        let color : any = d3.scaleOrdinal()
            .range(d3.quantize(d3.interpolateRainbow, data.children.length + 1))

        let format : any = d3.format(",d")

        let width : any = 600

        let radius : any = width / 6

        let arc : any = d3.arc()
            .startAngle((d : any) => d.x0)
            .endAngle((d : any) => d.x1)
            .padAngle((d : any) => Math.min((d.x1 - d.x0) / 2, 0.005))
            .padRadius(radius * 1.5)
            .innerRadius((d : any) => d.y0 * radius)
            .outerRadius((d : any) => Math.max(d.y0 * radius, d.y1 * radius - 1));

        const root : any = partition(data);

        root.each((d : any) => d.current = d);

        const svg : any = d3.select('#container')
            .style("width", "100%")
            .style("height", "auto")
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
            .on("click", clicked);

        path.append("title")
            .text((d : any) => `${d.ancestors().map((d : any) => d.data.name).reverse().join("/")}\n${format(d.value)}`);

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
            .on("click", clicked);

        function clicked(p : any) {
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
                .tween("data", (d: any) => {
                    const i = d3.interpolate(d.current, d.target);
                    return (t : any) => d.current = i(t);
                })
                .filter((d: any) : any => {
                    return +this.getAttribute("fill-opacity") || arcVisible(d.target);
                })
                .attr("fill-opacity", (d : any) => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
                .attrTween("d", (d : any) => () => arc(d.current));

            label.filter(function(d:any) : any {
                    return +this.getAttribute("fill-opacity") || labelVisible(d.target);
                }).transition(t)
                .attr("fill-opacity", (d : any) => +labelVisible(d.target))
                .attrTween("transform", (d : any) => () => labelTransform(d.current));
        }

        function arcVisible(d : any) : any {
            return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
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
        console.log('render')

        return (
            <div>
                <svg
                    ref='container'
                    width={600}
                    height={600}
                    className={'sunburst'}
                    id={'container'}
                >

                </svg>
            </div>
        )
    }
}
