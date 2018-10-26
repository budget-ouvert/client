import * as React from 'react'
import {Route} from 'react-router'
import {BrowserRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import {Navbar, Button, Alignment, ControlGroup, FormGroup, MenuItem} from '@blueprintjs/core'
import {Select, ItemPredicate, ItemRenderer} from "@blueprintjs/select";

import {
    appState
} from '../types'

import * as actions from '../actions'

import {SunburstModule} from '../components/sunburst'

const mapReduxStateToReactProps = (state : appState): appState => {
    return state
}

function reduxify(mapReduxStateToReactProps: any, mapDispatchToProps?: any, mergeProps?: any, options?: any) {
    return (target: any) => (connect(mapReduxStateToReactProps, mapDispatchToProps, mergeProps, options)(target) as any)
}

@reduxify(mapReduxStateToReactProps)
export class App extends React.Component<appState, any> {
    public render () {
        let {data} = this.props

        const key = 'Abracadabra'

        return (
            <div id='application'>
                <h1>Lolz</h1>
                    <SunburstModule
                        key={key}
                        data={data}
                        dimensions={{
                            height: window.innerHeight * 3 / 4,
                        }}
                        hideComplements={true}
                    />
            </div>
        )
    }
}
