import {
    Button,
    Callout,
    Code,
    Tag,
} from '@blueprintjs/core'
import * as React from 'react'
import { Redirect } from 'react-router-dom'

import './style.less'

import BetaHeader from '../../components/betaHeader'

interface IProps {

}

interface IState {
    shouldRedirect: boolean,
}

export default class IntroductionView extends React.Component<IProps, IState> {
    constructor(props: IProps) {
        super(props)
        this.state = {
            shouldRedirect: false,
        }
    }

    public render () {
        return <div id='main-container' className={'bp3-running-text bp3-text-large'}>
            <BetaHeader />
            {this.state.shouldRedirect ? <Redirect to='/visualisation' /> : null}
            <div id='introduction-page'>
                <h1>Visualisation de la dépense de l'État</h1>
                <p>
                    Ce site à pour but de donner à voir de manière intuitive la dépense annuelle de l'État français. Il s'adresse aux personnes novices comme expertes, et permet de consulter les dépenses hiérarchisées par Type de Mission, Mission, Programme et Action.
                </p>
                <p>
                    Cette page contient plusieurs définitions et explications utiles à la compréhension des résultats présentés par la suite.
                </p>

                <div className='centered-content'>
                    <Button
                        className='centered-button'
                        intent={'primary'}
                        onClick={() => this.setState({shouldRedirect: true,})}
                        rightIcon='chevron-right'
                    >
                        Continuer vers les dépenses
                    </Button>
                </div>

                <h2>Concepts utiles</h2>
                <Callout
                    title={'Hiérarchie de l\'information'}
                >
                    <p>
                        Les dépenses de l'État sont organisées selon une hiérarchie de concepts. Les différents niveaux hiérarchiques, par ordre croissant de précision, sont le <code>Type de Mission</code>, la <code>Mission</code>, le <code>Programme</code> et l'<code>Action</code>.
                    </p>
                    <p>
                        Exemples :
                    </p>
                    <ul>
                        <li>L'enseignement scolaire (<code>Mission</code>) appartient au Budget Général (<code>Type de Mission</code>)</li>
                        <li>L'enseignement scolaire public du second degré (<code>Programme</code>) appartient à l'Enseignement scolaire (<code>Mission</code>)</li>
                        <li>L'enseignement en collège (<code>Action</code>) appartient à l'Enseignement scolaire public du second degré (<code>Programme</code>)</li>
                    </ul>
                </Callout>
                <Callout
                    title={'Types de comptabilité'}
                >
                    <p>
                        Les dépenses associées à une action peuvent être précisées de plusieurs façon :
                    </p>
                    <ul>
                        <li>la <code>Comptabilité générale</code> décompose les actions en <code>Sous-actions</code> ; on parle alors de la <em>destination</em> de la dépense.</li>
                        <li>la <code>Comptabilité budgétaire</code> décompose les actions et les sous-actions en <code>Catégories</code> ; on parle alors de la <em>nature</em> de la dépense.</li>
                    </ul>
                    <p>
                        Exemples :
                    </p>
                    <ul>
                        <li>
                            L'Amélioration de l'efficacité du service public de l'emploi (<code>Action</code>) peut-être décomposée en :
                            <ul>
                                <li>L'indemnisation des demandeurs d'emplois (<code>Sous-action</code>) ~2,2 milliards d'euros</li>
                                <li>Coordination du service public de l'emploi (<code>Sous-action</code>) ~1,3 millard d'euros</li>
                            </ul>
                        </li>
                        <li>
                            L'indemnisation des demandeurs d'emplois (<code>Sous-action</code>) est elle-même divisée en deux <code>Catégories</code> :
                            <ul>
                                <li>Les Dépenses de fonctionnement autres que celles de personnel (<code>Catégorie</code>) ~10 000 euros</li>
                                <li>Les Transferts aux ménages (<code>Catégorie</code>) ~2,2 milliards d'euros</li>
                            </ul>
                        </li>
                    </ul>
                </Callout>
                <Callout
                    title={'Chronologie'}
                >
                    <p>
                        La chronologie du budget est la suivante :
                    </p>
                    <ul>
                        <li>Le Projet de Loi de Finances <code>PLF</code> est publié en octobre par le Ministère de l'Économie et des Finances avec les données prévisionnelles de la dépense de l'État.</li>
                        <li>Le <code>PLF</code> est examiné deux fois par l'Assemblée Nationale et le Sénat, qui votent la Loi de Finances Initiale <code>LFI</code> en janvier.</li>
                        <li>Le Projet de Loi de Réglement <code>PLR</code> est publié en juillet par le Ministère de l'Économie et des Finances avec les données de l'éxecution de la <code>LFI</code>.</li>
                        <li>Le <code>PLR</code> est examiné par le parlement qui vote la Loi de Règlement <code>LR</code> en décembre.</li>
                    </ul>
                    <p>
                        Au cours de l'année, la <code>LFI</code> peut être amendée au travers d'un ou plusieurs Projets de Loi de Finances Rectificatifs votés par le parlement.
                    </p>
                </Callout>
                <Callout
                    title={'Nature des montants'}
                >
                    <p>
                        Les documents mentionnés précédemment présentent deux types de montants :
                    </p>
                    <ul>
                        <li>Les Crédits de Paiement <code>CP</code> indiquent la dépense maximale qui peut effectivement être réalisée pendant l'année en cours. En général, l'intégralité des <code>CP</code> de l'année sont consommés.</li>
                        <li>Les Autorisations d'Engagement <code>AE</code> constituent la limite supérieure des dépenses pouvant être engagées.</li>
                    </ul>
                </Callout>
            </div>
        </div>
    }
}
