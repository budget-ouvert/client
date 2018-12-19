import * as React from 'react'
import {format} from 'd3'

interface IProps {
    label: string,
    path: string[],
    size: number,
}

interface IState {

}

export default class NodeViewer extends React.Component<IProps, IState> {
    public render() {
        let {
            label,
            path,
            size,
        } = this.props

        return (
            <div>
                <p className='spending'>{label} : {format(",d")(size).replace(/,/g, ' ')} euros</p>
                <ul className="bp3-breadcrumbs">
                  {path ?
                      path.map((item: string, index: number) => {
                          return <li key={index} className="bp3-breadcrumb">{item}</li>
                      }) :
                      null
                  }
                </ul>
            </div>
        )
    }
}
