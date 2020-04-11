import React from 'react';
import ReactDOM from 'react-dom';
import {
    HashRouter,
    Route,
    Switch
} from 'react-router-dom';

import indexRoutes from './routes/index.jsx';

import registerServiceWorker from './registerServiceWorker';

import './assets/css/bootstrap.min.css';
import './assets/sass/light-bootstrap-dashboard.css';
import './assets/css/demo.css';
import './assets/css/pe-icon-7-stroke.css';

ReactDOM.render((
    <HashRouter>
        <Switch>
            {
                indexRoutes.map((prop,key) => {
                    return (
                        <Route path={prop.path} component={prop.component}  key={key}/>
                    );
                })
            }
        </Switch>
    </HashRouter>
), document.getElementById('root'));
registerServiceWorker();
