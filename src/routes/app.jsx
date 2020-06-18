import Pages from '../containers/Pages/Pages.jsx';
import Dash from '../containers/Dash/Dash.jsx';
import Login2 from '../layouts/login2.jsx';
import Register from '../layouts/Register.jsx';
var appRoutes = [
    { path: "/pages/login-page", name: "Pages", component: Pages },
    { path: "/pages/register-page", name: "Pages", component: Pages },
    { path: "/pages/lock-screen-page", name: "Pages", component: Pages },
    { path: "/login", name: "Login", component: Login2 },
    { path: "/register", name: "Login", component: Register },
    { path: "/", name: "Home", component: Dash }
];

export default appRoutes;
