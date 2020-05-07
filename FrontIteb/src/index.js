/*!

=========================================================
* Light Bootstrap Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/light-bootstrap-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/light-bootstrap-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Switch } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/sass/light-bootstrap-dashboard-react.scss?v=1.3.0";
import "./assets/css/demo.css";
import "./assets/css/pe-icon-7-stroke.css";
import "../node_modules/react-datepicker/src/stylesheets/datepicker.scss"
import 'react-widgets/dist/css/react-widgets.css';


import UserLayout from "layouts/User";
import LoginLayout from "layouts/Login";
import RegisterLayout from "layouts/Register";
import login2 from "layouts/login2"
import CompleteLayout from "layouts/Complete"
import FullProfileLayout from "layouts/FullProfile"
import CompleteCompetanceLayout from "layouts/CompleteComps"
import TableList from "./layouts/ListUsers";
import GoogleLoginLayout from "./layouts/GoogleLogin";
import LinkedInPage from "./layouts/LinkedInPage";
import GroupLayout from "./layouts/Group";
import { LinkedInPopUp } from 'react-linkedin-login-oauth2';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
        <Route path="/" component={login2} exact />
        <Route path="/profile" component={UserLayout} exact />
        <Route path="/register" component={RegisterLayout} exact />
        <Route path="/forgotPassword" component={LoginLayout} exact />
        <Route path="/complete" component={CompleteLayout} exact />
        <Route path="/full" component={FullProfileLayout} exact />
        <Route path="/completecomps" component={CompleteCompetanceLayout} exact />
        <Route path="/user/list" component={TableList} exact />
        <Route path="/GoogleLogin" component={GoogleLoginLayout} exact />
        <Route exact path="/linkedin" component={LinkedInPopUp} />
        <Route path="/lin" component={LinkedInPage} />
        <Route path="/group" component={GroupLayout} />

    </Switch>
  </BrowserRouter>,
  document.getElementById("root")
);
