import {
    Icon,
} from '@blueprintjs/core'
import * as React from 'react'

interface IProps {
    path: string[],
}

interface IState {
}

export default class PlfPath extends React.Component<IProps, IState> {
    public render = () => {
        const {
            path,
        } = this.props

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
