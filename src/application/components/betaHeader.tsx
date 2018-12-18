import {
    Tag,
} from '@blueprintjs/core'
import * as React from 'react'

interface IProps {

}

interface IState {

}

export default class BetaHeader extends React.Component<IProps, IState> {
    public render() {
        return <div id='beta-header'>
            <div className='flex-box'>
                <Tag intent={'primary'}>Alpha</Tag>
                <p>
                    Ce site est en version alpha : il peut comporter des erreurs.<br/>
                    Source des données : <a href="https://data.gouv.fr">https://data.gouv.fr</a>
                </p>
            </div>
            <div>
                <p>alexis [dot] thual [at] gmail [dot] com</p>
            </div>
        </div>
    }
}
