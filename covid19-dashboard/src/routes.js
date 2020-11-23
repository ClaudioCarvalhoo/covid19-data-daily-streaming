import AssessmentIcon from "@material-ui/icons/Assessment";
import MapIcon from "@material-ui/icons/Map";

import DashboardPage from "views/Dashboard/Dashboard.js";
import Livemap from "views/Livemap/Livemap.js";

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
    component: Livemap,
    layout: "/admin",
  },
];

export default dashboardRoutes;
