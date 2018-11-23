import * as React from 'react'

interface Props {
    path: string[];
}

interface State {

}

export default class NodeViewer extends React.Component<Props, State> {
    public render() {
        let {path} = this.props;

        return (
            <div>
                <ul className="bp3-breadcrumbs">
                  {path ?
                      path.map((item: string) => {
                          return <li><a className="bp3-breadcrumb">{item}</a></li>
                      }) :
                      null
                  }
                </ul>

            </div>
        )
    }
}
