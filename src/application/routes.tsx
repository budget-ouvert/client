import * as React from 'react'
import {Route} from 'react-router'
import {
    BrowserRouter,
    Switch,
} from 'react-router-dom'

import {Main} from './views/main'
import {Verification} from './views/verification'

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={Main}/>
            <Route path='/verification' component={Verification}/>
        </Switch>
    </BrowserRouter>
)

export default Routes
