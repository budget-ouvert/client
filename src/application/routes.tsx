import * as React from 'react'
import {Route} from 'react-router'
import {
    BrowserRouter,
    Switch,
} from 'react-router-dom'

import MainView from './views/main'
import VerificationView from './views/verification'

const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path='/' component={MainView}/>
            <Route path='/verification' component={VerificationView}/>
        </Switch>
    </BrowserRouter>
)

export default Routes
