import {
    Button,
    Divider,
    Icon,
    Navbar,
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
                    Ce site est en version alpha : les données peuvent être incomplètes et le code présenter des erreurs.<br/>
                    Source des données : <a href="https://data.gouv.fr">https://data.gouv.fr</a>
                </p>
            </div>
            <div className='flex-box bp3-dark'>
                <Icon icon={'inbox'} />
                <p>alexis [dot] thual [at] gmail [dot] com</p>
                <Navbar.Divider />
                <Button icon={'git-repo'} minimal={true} onClick={() => {
                    window.location.href = 'https://github.com/budget-ouvert/'}}
                >Git Repo</Button>
            </div>
        </div>
    }
}
