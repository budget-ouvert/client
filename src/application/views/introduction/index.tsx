import {
    Button,
    Callout,
    Code,
} from '@blueprintjs/core'
import * as React from 'react'

import './style.less'

export default class IntroductionView extends React.Component<any, any> {
    public render () {
        return <div id='main-container'>
            <h1>Visualisation de la dépense de l'État</h1>
            <p>
                Ce site à pour but de donner à voir de manière intelligible la dépense annuelle de l'État français. Il s'adresse aux personnes novices comme aux experts. Nous permettons de consulter les dépenses hierarchisées par Type de Mission, Mission, Programme et Action.<br/>
                Nous donnons sur cette page plusieurs informations utiles à la compréhension des résultats présentés après.
            </p>
            <Button
                icon='chevron-right'
                intent={'primary'}
            >
                Continuer vers les dépenses
            </Button>

            <h2>Concepts utiles</h2>
            <Callout
                title={'Hiérarchie de l\'information'}
            >
                Type de Mission, Mission, Programme, etc
            </Callout>
            <Callout
                title={'Chronologie'}
            >
                PLF - LFI - LR
            </Callout>
            <Callout
                title={'Nature des montants'}
            >
                CP - AE
            </Callout>
            <Callout
                title={'Types de comptabilité'}
            >
                Comptabilité budgétaire (Mission - Nature) - Comptabilité générale (Mission - Destination)
            </Callout>
        </div>
    }
}
