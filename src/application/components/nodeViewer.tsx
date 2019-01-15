import * as React from 'react'
import {format} from 'd3'

interface IProps {
    label: string,
    path: string[],
    sizes: number[],
}

interface IState {

}

export default class NodeViewer extends React.Component<IProps, IState> {
    public render() {
        let {
            label,
            path,
            sizes,
        } = this.props

        return (
            <div>
                <p className='spending'>{label} : {format(",d")(sizes[sizes.length-1]).replace(/,/g, ' ')} euros</p>
                <ul className="bp3-breadcrumbs">
                  {path ?
                      path.map((item: string, index: number) => {
                          return <li key={index} className="bp3-breadcrumb">{item} ({Math.round(sizes[sizes.length-1] / sizes[index] * 10000) / 100} %)</li>
                      }) :
                      null
                  }
                </ul>
            </div>
        )
    }
}
