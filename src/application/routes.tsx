import * as React from 'react'
import {Route} from 'react-router'
import {BrowserRouter} from 'react-router-dom'

import {App} from './containers/app'

const Routes = () => (
    <BrowserRouter>
        <Route path='/' component={App}/>
    </BrowserRouter>
)

export default Routes
