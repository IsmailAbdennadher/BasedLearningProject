import Dashboard from '../views/Dashboard/Dashboard.jsx';
import Buttons from '../views/Components/Buttons.jsx';
import GridSystem from '../views/Components/GridSystem.jsx';
import Panels from '../views/Components/Panels.jsx';
import SweetAlert from '../views/Components/SweetAlertPage.jsx';
import Notifications from '../views/Components/Notifications.jsx';
import Icons from '../views/Components/Icons.jsx';
import Typography from '../views/Components/Typography.jsx';
import RegularForms from '../views/Forms/RegularForms.jsx';
import ExtendedForms from '../views/Forms/ExtendedForms.jsx';
import ValidationForms from '../views/Forms/ValidationForms.jsx';
import Wizard from '../views/Forms/Wizard/Wizard.jsx';
import RegularTables from '../views/Tables/RegularTables.jsx';
import ExtendedTables from '../views/Tables/ExtendedTables.jsx';
import DataTables from '../views/Tables/DataTables.jsx';
import GoogleMaps from '../views/Maps/GoogleMaps.jsx';
import FullScreenMap from '../views/Maps/FullScreenMap.jsx';
import VectorMap from '../views/Maps/VectorMap.jsx';
import Charts from '../views/Charts/Charts.jsx';
import Calendar from '../views/Calendar/Calendar.jsx';
import UserPage from '../views/Pages/UserPage.jsx';
import EquipeForms from '../views/Forms/EquipeForms.jsx';
import SujetForms from '../views/Forms/SujetForms.jsx';
import ListeSujets from '../views/Components/ListeSujets.jsx';
import SujetEdit from '../views/Forms/SujetEdit.jsx';
import EquipesAleatoire from '../views/Tables/EquipesAleatoire.jsx';
import FormationEquipe from '../views/Forms/FormationEquipe.jsx';
import ChoixEquipeSujets from '../views/Forms/ChoixEquipeSujets.jsx';
import EquipesChoixTable from '../views/Tables/EquipesChoixTable.jsx';
import ProjetForms from '../views/Forms/ProjetForms.jsx';
import ListeProjets from '../views/Components/ListeProjets.jsx';
import ListeSujetsProjets from '../views/Components/ListeSujetsProjets.jsx';
import ProjetEdit from '../views/Forms/ProjetEdit.jsx';
import AffectationChoixEquipe from '../views/Forms/AffectationChoixEquipe.jsx';
import GetFormationEquipe from '../views/Forms/GetFormationEquipe.jsx';
import GetSujetsEquipe from '../views/Forms/GetSujetsEquipe.jsx';
import UserLayout from "../layouts/User.jsx";
import LoginLayout from "../layouts/Login.jsx";
import RegisterLayout from "../layouts/Register.jsx";
import login2 from "../layouts/login2.jsx";
import CompleteLayout from "../layouts/Complete.jsx";
import FullProfileLayout from "../layouts/FullProfile.jsx";
import CompleteCompetanceLayout from "../layouts/CompleteComps.jsx";
import TableList from "../layouts/ListUsers.jsx";
import GoogleLoginLayout from "../layouts/GoogleLogin.jsx";
import LinkedInPage from "../layouts/LinkedInPage.jsx";
import GroupLayout from "../layouts/Group.jsx";
import { LinkedInPopUp } from 'react-linkedin-login-oauth2';
import jwt_decode from "jwt-decode";

import pagesRoutes from './pages.jsx';

var pages = [{ path: "/pages/user-page", name: "User Page", mini: "UP", component: UserPage }].concat(pagesRoutes);
function role(array,role){
    for(var x of array){
        if(x.nom==role){
            return true;
        }
    }
    return false;
}
var roles_projet = ["admin", "coordinateur"];
var role_sous_projet=["tuteur", "formateur", "porteur"];
var etudiant=['apprenant'];
var role_admin=false;
var role_coordinateur=false;
var role_tuteur=false;
var role_formateur=false;
var role_porteur=false;
var role_apprenant=false;
if(localStorage.token){
   role_admin=role(jwt_decode(localStorage.token).user.role,"admin");
   role_coordinateur=role(jwt_decode(localStorage.token).user.role,"coordinateur");
   role_tuteur=role(jwt_decode(localStorage.token).user.role,"tuteur");
   role_formateur=role(jwt_decode(localStorage.token).user.role,"formateur");
   role_porteur=role(jwt_decode(localStorage.token).user.role,"porteur");
   role_apprenant=role(jwt_decode(localStorage.token).user.role,"apprenant");
}

var dashRoutes = [
    { path: "/dashboard", name: "Dashboard", icon: "pe-7s-graph", component: Dashboard },
    { collapse: true, path: "/components", name: "Components", state: "openComponents", icon: "pe-7s-plugin", views:[
        { path: "/components/buttons", name: "Buttons", mini: "B", component: Buttons },
        { path: "/components/grid-system", name: "Grid System", mini: "GS", component: GridSystem },
        { path: "/components/panels", name: "Panels", mini: "P", component: Panels },
        { path: "/components/sweet-alert", name: "Sweet Alert", mini: "SA", component: SweetAlert },
        { path: "/components/notifications", name: "Notifications", mini: "N", component: Notifications },
        { path: "/components/icons", name: "Icons", mini: "I", component: Icons },
        { path: "/components/typography", name: "Typography", mini: "T", component: Typography }]
    },
    { path: "/login", name: "Users", icon: "pe-7s-graph", component: login2 },
    { collapse: true, path: "/users", name: "users", state: "openUsers", icon: "pe-7s-plugin", views:[
        { path: "/profile", name: "Profile", mini: "P", component: UserLayout },
        { path: "/register", name: "Register", mini: "R", component: RegisterLayout },
        { path: "/forgotPassword", name: "forgotPassword", mini: "FP", component: LoginLayout },
        { path: "/complete", name: "Complete info", mini: "SA", component: CompleteLayout },
        { path: "/full", name: "FullProfile", mini: "FP", component: FullProfileLayout },
        { path: "/completecomps", name: "Complete Competance", mini: "CC", component: CompleteCompetanceLayout },
        { path: "/user/list", name: "Table users", mini: "T", component: TableList },
        { path: "/GoogleLogin", name: "Sweet Alert", mini: "SA", component: GoogleLoginLayout },
        { path: "/linkedin", name: "LinkedInPopUp", mini: "N", component: LinkedInPopUp },
        { path: "/lin", name: "LinkedInPage", mini: "LI", component: LinkedInPage },
        { path: "/group", name: "Group", mini: "G", component: GroupLayout }]
    },
    { collapse: true, path: "/forms", name: "Projet", state: "openForms", icon: "pe-7s-note2", views:
        [{ path: "/forms/projet", name: "Ajouter Projet", mini: "AP", component: ProjetForms,invisible:!(role_admin||role_coordinateur) },
        { path: "/forms/Listeprojets", name: "Liste Projets", mini: "LP", component: ListeProjets,invisible:!(role_admin||role_coordinateur) },
        { path: "/edit/projets/:id", name: "Modifer Sujet", mini: "AS", component: ProjetEdit , invisible:true },
        { path: "/forms/equipes", name: "Ajouter Equipe", mini: "EE", component: EquipeForms,invisible:!role_apprenant },
        { path: "/forms/FormerEquipe", name: "Formation Equipe", mini: "FE", component: FormationEquipe,invisible:!((role_admin||role_coordinateur)&&localStorage.projet) },
        { path: "/forms/sujets", name: "Ajouter Sujet", mini: "AS", component: SujetForms,invisible:!((role_admin||role_coordinateur)&&localStorage.projet) },
        { path: "/forms/Listesujets", name: "Liste Sujets", mini: "LS", component: ListeSujets,invisible:!((role_admin||role_coordinateur)&&localStorage.projet) },
        { path: "/forms/Listesujetsprojets", name: "Sujets du Projet", mini: "SP", component: ListeSujetsProjets,invisible:!((role_admin||role_coordinateur)&&localStorage.projet) },
        { path: "/edit/sujets/:id", name: "Modifer Sujet", mini: "AS", component: SujetEdit , invisible:true },
        { path: "/ChoixEquipeSujets", name: "Choix Equipe Sujets", mini: "AS", component: ChoixEquipeSujets,invisible:!((role_apprenant)&&localStorage.projet) },
        { path: "/AffectationChoixEquipe", name: "Affecter Sujets Aléa", mini: "AS", component: AffectationChoixEquipe,invisible:!((role_admin||role_coordinateur)&&localStorage.projet) },
        { path: "/forms/regular-forms", name: "Regular Forms", mini: "RF", component: RegularForms,invisible:true },
        { path: "/forms/extended-forms", name: "Extended Forms", mini: "EF", component: ExtendedForms,invisible:true },
        { path: "/forms/validation-forms", name: "Validation Forms", mini: "VF", component: ValidationForms,invisible:true },
        { path: "/forms/wizard", name: "Wizard", mini: "W", component: Wizard, invisible:true }]
    },
    { collapse: true, path: "/tables", name: "Tables", state: "openTables", icon: "pe-7s-news-paper", views:
        [{ path: "/tables/ChoixEquipes", name: "Sujets Equipes", mini: "SE", component: GetSujetsEquipe },
        { path: "/tables/EquipesChoix", name: "Sujets Equipes", mini: "SE", component: EquipesChoixTable, invisible:true },
        { path: "/tables/ListeAleatoire", name: "Liste aleatoire", mini: "LA", component: GetFormationEquipe, invisible:!((role_admin||role_coordinateur)&&localStorage.projet) },
        { path: "/tables/ListeEquipes", name: "Liste aleatoire", mini: "LA", component: EquipesAleatoire, invisible:true },
        { path: "/tables/regular-tables", name: "Regular Tables", mini: "RT", component: RegularTables,invisible:true },
        { path: "/tables/extended-tables", name: "Extended Tables", mini: "ET", component: ExtendedTables,invisible:true },
        { path: "/tables/data-tables", name: "Data Tables", mini: "DT", component: DataTables,invisible:true }]
    },
    { collapse: true, path: "/maps", name: "Maps", state: "openMaps", icon: "pe-7s-map-marker", views:
        [{ path: "/maps/google-maps", name: "Google Maps", mini: "GM", component: GoogleMaps },
        { path: "/maps/full-screen-maps", name: "Full Screen Map", mini: "FSM", component: FullScreenMap },
        { path: "/maps/vector-maps", name: "Vector Map", mini: "VM", component: VectorMap }]
    },
    { path: "/charts", name: "Charts", icon: "pe-7s-graph1", component: Charts },
    { path: "/calendar", name: "Calendar", icon: "pe-7s-date", component: Calendar },
    { collapse: true, path: "/pages", name: "Pages", state: "openPages", icon:"pe-7s-gift", views:
        pages
    },
    { redirect: true, path: "/", pathTo: "/login", name: "Users" }
];
export default dashRoutes;
