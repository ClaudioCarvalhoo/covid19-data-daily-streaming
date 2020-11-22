/*!

=========================================================
* Material Dashboard React - v1.9.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
// @material-ui/icons
import AssessmentIcon from "@material-ui/icons/Assessment";
import MapIcon from "@material-ui/icons/Map";
// core components/views for Admin layout
import DashboardPage from "views/Dashboard/Dashboard.js";
import UserProfile from "views/UserProfile/UserProfile.js";

const dashboardRoutes = [
  {
    path: "/charts",
    name: "Gráficos",
    icon: AssessmentIcon,
    component: DashboardPage,
    layout: "/admin",
  },
  {
    path: "/map",
    name: "Mapa ao vivo",
    icon: MapIcon,
    component: UserProfile,
    layout: "/admin",
  },
];

export default dashboardRoutes;
