import {
    Callout,
    Code,
} from '@blueprintjs/core'
import * as React from 'react'

import './style.less'

export default class IntroductionView extends React.Component<any, any> {
    public render () {
        return <div id='main-container'>
            <h2>Visualisation du Projet de Loi de Finance</h2>
            <p>
                Ce site donne à voir la répartition des dépenses du Projet de Loi de Finance par année. Il est destiné aux personnes souhaitant avoir une meilleure vision de la répartition des dépenses de l'état.<br/>
                On peut y consulter les <Code>Crédits de paiement</Code> hiérarchisés par <Code>Type de mission</Code>, <Code>Mission</Code>, <Code>Programme</Code>, <Code>Action</Code> et <Code>Sous-action</Code> lorsque cette dernière est précisée.
            </p>
            <h3>Définitions utiles</h3>
            <Callout
                icon={'layout-hierarchy'}
                title={'Projet de Loi de Finance'}
            >
                Présenté chaque année en octobre par le Ministère de l'Économie et des Finances, le PLF est ensuite approuvé par l'Assemblée et le Sénat.
            </Callout>
            <Callout
                icon={'euro'}
                title={'Crédits de paiement'}
            >
                Présenté chaque année en octobre par le Ministère de l'Économie et des Finances, le PLF est ensuite approuvé par l'Assemblée et le Sénat. Il ne faut pas les confondre avec les Autorisations d'Engagement, qu'il faut comprendre comme une prévision à une année donnée de Crédits de Paiement étalés sur plusieurs années.
            </Callout>
        </div>
    }
}
