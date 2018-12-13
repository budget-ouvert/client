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
                <p className='spending'>Crédits de paiement : {format(",d")(size).replace(/,/g, ' ')} euros</p>
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
