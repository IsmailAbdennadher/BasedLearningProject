import Pages from 'containers/Pages/Pages.jsx';
import Dash from 'containers/Dash/Dash.jsx';
import login2 from "layouts/login2";
import Register from "layouts/Register";
var appRoutes = [
    { path: "/pages/login-page", name: "Pages", component: Pages },
    { path: "/pages/register-page", name: "Pages", component: Pages },
    { path: "/pages/lock-screen-page", name: "Pages", component: Pages },
    { path: "/login", name: "Login", component: login2 },
    { path: "/register", name: "Login", component: Register },
    { path: "/", name: "Home", component: Dash }
];

export default appRoutes;
