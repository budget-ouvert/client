import * as React from 'react'
import {format} from 'd3'

interface Props {
    path: string[],
    size: number,
}

interface State {

}

export default class NodeViewer extends React.Component<Props, State> {
    public render() {
        let {
            path,
            size,
        } = this.props

        return (
            <div>
                <ul className="bp3-breadcrumbs">
                  {path ?
                      path.map((item: string, index: number) => {
                          return index + 1 != path.length ?
                            <li key={index}><a className="bp3-breadcrumb">{item}</a></li> :
                            <li key={index}><a className="bp3-breadcrumb">{item} ({format(",d")(size)} euros)</a></li>
                      }) :
                      null
                  }
                </ul>
            </div>
        )
    }
}
