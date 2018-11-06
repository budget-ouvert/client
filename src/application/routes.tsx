import * as React from 'react'
import {Route} from 'react-router'
import {BrowserRouter} from 'react-router-dom'

import {Main} from './views/main'

const Routes = () => (
    <BrowserRouter>
        <Route path='/' component={Main}/>
    </BrowserRouter>
)

export default Routes
