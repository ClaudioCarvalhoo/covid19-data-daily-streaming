import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
// react plugin for creating charts
import ChartistGraph from "react-chartist";
// @material-ui/core
import { makeStyles } from "@material-ui/core/styles";
import { Icon, Typography } from "@material-ui/core";
// @material-ui/icons
import Store from "@material-ui/icons/Store";
import Warning from "@material-ui/icons/Warning";
import CancelIcon from "@material-ui/icons/Cancel";
import WarningIcon from "@material-ui/icons/Warning";
import DateRange from "@material-ui/icons/DateRange";
import LocalOffer from "@material-ui/icons/LocalOffer";
import Update from "@material-ui/icons/Update";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import AccessTime from "@material-ui/icons/AccessTime";
import Accessibility from "@material-ui/icons/Accessibility";
import BugReport from "@material-ui/icons/BugReport";
import Code from "@material-ui/icons/Code";
import Cloud from "@material-ui/icons/Cloud";
// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Table from "components/Table/Table.js";
import Tasks from "components/Tasks/Tasks.js";
import CustomTabs from "components/CustomTabs/CustomTabs.js";
import Danger from "components/Typography/Danger.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardIcon from "components/Card/CardIcon.js";
import CardBody from "components/Card/CardBody.js";
import CardFooter from "components/Card/CardFooter.js";

import { bugs, website, server } from "variables/general.js";
import Chartist from "chartist";
import {
  fetchStreamData,
  fetchStatePopulation,
} from "../../store/actions/index";

import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart,
} from "variables/charts.js";

import styles from "assets/jss/material-dashboard-react/views/dashboardStyle.js";

const useStyles = makeStyles(styles);

function monthNumberToString(monthNumber) {
  switch (monthNumber) {
    case "01":
      return "Janeiro";
    case "02":
      return "Fevereiro";
    case "03":
      return "Março";
    case "04":
      return "Abril";
    case "05":
      return "Maio";
    case "06":
      return "Junho";
    case "07":
      return "Julho";
    case "08":
      return "Agosto";
    case "09":
      return "Setembro";
    case "10":
      return "Outubro";
    case "11":
      return "Novembro";
    case "12":
      return "Dezembro";
    default:
      return "";
  }
}

function increaseText(increaseRate) {
  if (increaseRate >= 50) {
    return `Aumentando rapidamente. ${increaseRate}% more`;
  }
  if (increaseRate < 50 && increaseRate >= 30) {
    return `Aumentando moderadamente. ${increaseRate}% more`;
  }
  if (increaseRate < 30 && increaseRate > 0) {
    return `Aumentando levemente. ${increaseRate}% more`;
  } else {
    return `Estável`;
  }
}

export default function Dashboard() {
  const classes = useStyles();
  const dispatch = useDispatch();

  const data = useSelector((state) => state.dashboard);
  console.log(data);

  useEffect(() => {
    dispatch(fetchStreamData());
    dispatch(fetchStatePopulation());
  }, [dispatch]);

  function buildChart(chartData) {
    return {
      labels: ["", "", "", "", "", "", ""],
      series: [chartData],
    };
  }

  function buildBarChart(chartData) {
    return {
      labels: [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ],
      series: chartData,
    };
  }
  function buildChartOptions(chartData) {
    const high =
      chartData.reduce(function (a, b) {
        return Math.max(a, b);
      }) + 100;

    return {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0,
      }),
      low: 0,
      high: high,
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      axisY: {
        labelInterpolationFnc: function (value) {
          if (value >= 1000) return value / 1000 + "k";
          if (value >= 1000000) return value / 1000000 + "kk";
          return value;
        },
      },
    };
  }

  function buildBarChartOptions(chartData) {
    const high =
      Math.max(
        chartData[0].reduce(function (a, b) {
          return Math.max(a, b);
        }),
        chartData[1].reduce(function (a, b) {
          return Math.max(a, b);
        })
      ) + 100;

    return {
      lineSmooth: Chartist.Interpolation.cardinal({
        tension: 0,
      }),
      low: 0,
      high: high,
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      axisY: {
        labelInterpolationFnc: function (value) {
          if (value >= 1000) return value / 1000 + "k";
          if (value >= 1000000) return value / 1000000 + "kk";
          return value;
        },
      },
    };
  }

  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="danger" stats icon>
              <CardIcon color="danger">
                <CancelIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Mortes Confirmadas</p>
              <h3 className={classes.cardTitle}>
                {data.data.reports ? data.data.reports.BR.deaths : ""}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Danger>
                  <Warning />
                </Danger>
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                  {increaseText(data.rate_deaths)}
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="warning" stats icon>
              <CardIcon color="warning">
                <WarningIcon />
              </CardIcon>
              <p className={classes.cardCategory}>Casos Confirmados</p>
              <h3 className={classes.cardTitle}>
                {data.data.reports ? data.data.reports.BR.cases : ""}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Danger>
                  <Warning />
                </Danger>
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                  {increaseText(data.rate_cases)}
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={3}>
          <Card>
            <CardHeader color="primary" stats icon>
              <CardIcon color="primary">
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Informações Gerais</p>
              <Typography variant="body2" className={classes.cardTitle}>
                Dias desde o começo: {data.daysSinceStarted}
              </Typography>
              <Typography variant="body2" className={classes.cardTitle}>
                Casos hoje: {data.today_cases}
              </Typography>
              <Typography variant="body2" className={classes.cardTitle}>
                Mortes hoje: {data.today_deaths}
              </Typography>
            </CardHeader>
            <CardFooter stats></CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={buildChart(data.lastSevenDays_newCases)}
                type="Line"
                options={buildChartOptions(data.lastSevenDays_newCases)}
                listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>
                Análise Semanal: Novos Casos
              </h4>
              <p className={classes.cardCategory}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                </span>{" "}
                de aumento desde a semana anterior.
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Atualizado em {data.timeLastUpdated.toString()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={buildChart(data.lastSevenDays_cases)}
                type="Line"
                options={buildChartOptions(data.lastSevenDays_cases)}
                listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>
                Análise Semanal: Casos Absolutos
              </h4>
              <p className={classes.cardCategory}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                </span>{" "}
                de aumento desde a semana anterior.
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Atualizado
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={buildChart(data.lastSevenDays_newDeaths)}
                type="Line"
                options={buildChartOptions(data.lastSevenDays_newDeaths)}
                listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>
                Análise Semanal: Novas Mortes
              </h4>
              <p className={classes.cardCategory}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                </span>{" "}
                de aumento desde a semana anterior.
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Atualizado em {data.timeLastUpdated.toString()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color="success">
              <ChartistGraph
                className="ct-chart"
                data={buildChart(data.lastSevenDays_deaths)}
                type="Line"
                options={buildChartOptions(data.lastSevenDays_deaths)}
                listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>
                Análise Semanal: Mortes Absolutas
              </h4>
              <p className={classes.cardCategory}>
                <span className={classes.successText}>
                  <ArrowUpward className={classes.upArrowCardCategory} /> 55%
                </span>{" "}
                de aumento desde a semana anterior.
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Atualizado
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>
      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card chart>
            <CardHeader color="warning">
              <ChartistGraph
                className="ct-chart"
                data={buildBarChart([data.months_cases, data.months_deaths])}
                type="Bar"
                options={buildBarChartOptions([
                  data.months_cases,
                  data.months_deaths,
                ])}
                responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                listener={emailsSubscriptionChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Análise Mensal: Novos Casos</h4>
              <p className={classes.cardCategory}>O Mês </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> atualizado
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <CustomTabs
            title="Tasks:"
            headerColor="primary"
            tabs={[
              {
                tabName: "Bugs",
                tabIcon: BugReport,
                tabContent: (
                  <Tasks
                    checkedIndexes={[0, 3]}
                    tasksIndexes={[0, 1, 2, 3]}
                    tasks={bugs}
                  />
                ),
              },
              {
                tabName: "Website",
                tabIcon: Code,
                tabContent: (
                  <Tasks
                    checkedIndexes={[0]}
                    tasksIndexes={[0, 1]}
                    tasks={website}
                  />
                ),
              },
              {
                tabName: "Server",
                tabIcon: Cloud,
                tabContent: (
                  <Tasks
                    checkedIndexes={[1]}
                    tasksIndexes={[0, 1, 2]}
                    tasks={server}
                  />
                ),
              },
            ]}
          />
        </GridItem>
        <GridItem xs={12} sm={12} md={6}>
          <Card>
            <CardHeader color="warning">
              <h4 className={classes.cardTitleWhite}>Estado a estado</h4>
              <p className={classes.cardCategoryWhite}>
                Novos casos chegam todos os dias
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor="warning"
                tableHead={[
                  "Estado",
                  "Casos",
                  "Mortes",
                  "Novos Casos",
                  "Novas Mortes",
                ]}
                tableData={data.states}
              />
            </CardBody>
          </Card>
        </GridItem>
      </GridContainer>
    </div>
  );
}
