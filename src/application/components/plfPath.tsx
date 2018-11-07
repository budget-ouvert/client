import {
    Icon,
} from '@blueprintjs/core'
import * as React from 'react'

interface Props {
    path: string[],
}

interface State {

}

export default class PlfPath extends React.Component<Props, State> {
    public render() {
        let {path} = this.props;

        return (
            <div className='plf-path'>
                {
                    path ?
                        path.map((node: string, index: number) =>
                            <div className='plf-path-node' key={index}>
                                <div className='node-name'>{node}</div>
                                {
                                    (index != path.length - 1) ?
                                        <Icon icon='chevron-down' iconSize={10}/> :
                                        null
                                }
                            </div>
                        ) :
                        <span>Can't find key</span>
                }
            </div>
        )
    }
}
