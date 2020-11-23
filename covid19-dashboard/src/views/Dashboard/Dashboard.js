import { Icon, Typography } from '@material-ui/core';
// @material-ui/core
import { makeStyles } from '@material-ui/core/styles';
import AccessTime from '@material-ui/icons/AccessTime';
import ArrowUpward from '@material-ui/icons/ArrowUpward';
import { default as Warning } from '@material-ui/icons/Warning';
import styles from 'assets/jss/material-dashboard-react/views/dashboardStyle.js';
import Chartist from 'chartist';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardFooter from 'components/Card/CardFooter.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardIcon from 'components/Card/CardIcon.js';
import GridContainer from 'components/Grid/GridContainer.js';
// core components
import GridItem from 'components/Grid/GridItem.js';
import Table from 'components/Table/Table.js';
import Danger from 'components/Typography/Danger.js';
import React from 'react';
// react plugin for creating charts
import ChartistGraph from 'react-chartist';
import { FaCross } from 'react-icons/fa';
import { RiVirusFill } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { dailySalesChart, emailsSubscriptionChart } from 'variables/charts.js';

const useStyles = makeStyles(styles);

function increaseText(increaseRate) {
  if (increaseRate >= 50) {
    return `Aumentando rapidamente. Aumento de ${increaseRate}%.`;
  }
  if (increaseRate < 50 && increaseRate >= 30) {
    return `Aumentando moderadamente. Aumento de ${increaseRate}%.`;
  }
  if (increaseRate < 30 && increaseRate > 0) {
    return `Aumentando levemente. Aumento de ${increaseRate}%.`;
  } else {
    return `Estável`;
  }
}

export default function Dashboard() {
  const classes = useStyles();

  const data = useSelector(state => state.dashboard);
  console.log(data);

  function buildChart(chartData) {
    return {
      labels: ['', '', '', '', '', '', ''],
      series: [chartData],
    };
  }

  function buildBarChart(chartData) {
    return {
      labels: [
        'Jan',
        'Fev',
        'Mar',
        'Abr',
        'Mai',
        'Jun',
        'Jul',
        'Ago',
        'Set',
        'Out',
        'Nov',
        'Dez',
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
          if (value >= 1000) return value / 1000 + 'k';
          if (value >= 1000000) return value / 1000000 + 'kk';
          return value;
        },
      },
    };
  }

  function buildBarChartOptions(chartData) {
    let high = chartData[0].reduce(function (a, b) {
      return Math.max(a, b);
    });

    if (chartData[1]) {
      Math.max(
        high,
        chartData[1].reduce(function (a, b) {
          return Math.max(a, b);
        })
      );
    }

    high += 100;

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
          if (value >= 1000) return value / 1000 + 'k';
          if (value >= 1000000) return value / 1000000 + 'kk';
          return value;
        },
      },
    };
  }
  function monthNumberToString(monthNumber) {
    switch (monthNumber) {
      case '01':
        return 'Janeiro';
      case '02':
        return 'Fevereiro';
      case '03':
        return 'Março';
      case '04':
        return 'Abril';
      case '05':
        return 'Maio';
      case '06':
        return 'Junho';
      case '07':
        return 'Julho';
      case '08':
        return 'Agosto';
      case '09':
        return 'Setembro';
      case '10':
        return 'Outubro';
      case '11':
        return 'Novembro';
      case '12':
        return 'Dezembro';
      default:
        return '';
    }
  }
  return (
    <div>
      <GridContainer>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color='danger' stats icon>
              <CardIcon color='danger'>
                <FaCross />
              </CardIcon>
              <p className={classes.cardCategory}>Mortes Confirmadas</p>
              <h3 className={classes.cardTitle}>
                {data.data.reports ? data.data.reports.BR.deaths : ''}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Danger>
                  <Warning />
                </Danger>
                <a href='#pablo' onClick={e => e.preventDefault()}>
                  {increaseText(data.rate_deaths)}
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color='warning' stats icon>
              <CardIcon color='warning'>
                <RiVirusFill />
              </CardIcon>
              <p className={classes.cardCategory}>Casos Confirmados</p>
              <h3 className={classes.cardTitle}>
                {data.data.reports ? data.data.reports.BR.cases : ''}
              </h3>
            </CardHeader>
            <CardFooter stats>
              <div className={classes.stats}>
                <Danger>
                  <Warning />
                </Danger>
                <a href='#pablo' onClick={e => e.preventDefault()}>
                  {increaseText(data.rate_cases)}
                </a>
              </div>
            </CardFooter>
          </Card>
        </GridItem>
        <GridItem xs={12} sm={6} md={4}>
          <Card>
            <CardHeader color='primary' stats icon>
              <CardIcon color='primary'>
                <Icon>info_outline</Icon>
              </CardIcon>
              <p className={classes.cardCategory}>Informações Gerais</p>
              <Typography variant='body2' className={classes.cardTitle}>
                Dias desde o começo: {data.daysSinceStarted}
              </Typography>
              <Typography variant='body2' className={classes.cardTitle}>
                Casos hoje: {data.today_cases}
              </Typography>
              <Typography variant='body2' className={classes.cardTitle}>
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
            <CardHeader color='success'>
              <ChartistGraph
                className='ct-chart'
                data={buildChart(data.lastSevenDays_newCases)}
                type='Line'
                options={buildChartOptions(data.lastSevenDays_newCases)}
                listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>
                Análise Semanal: Novos Casos
              </h4>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Atualizado: {data.timeLastUpdated.toString()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color='success'>
              <ChartistGraph
                className='ct-chart'
                data={buildChart(data.lastSevenDays_newDeaths)}
                type='Line'
                options={buildChartOptions(data.lastSevenDays_newDeaths)}
                listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>
                Análise Semanal: Novas Mortes
              </h4>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Atualizado: {data.timeLastUpdated.toString()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color='success'>
              <ChartistGraph
                className='ct-chart'
                data={buildChart(data.lastSevenDays_cases)}
                type='Line'
                options={buildChartOptions(data.lastSevenDays_cases)}
                listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>
                Análise Semanal: Casos Absolutos
              </h4>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Atualizado: {data.timeLastUpdated.toString()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>

        <GridItem xs={12} sm={12} md={6}>
          <Card chart>
            <CardHeader color='success'>
              <ChartistGraph
                className='ct-chart'
                data={buildChart(data.lastSevenDays_deaths)}
                type='Line'
                options={buildChartOptions(data.lastSevenDays_deaths)}
                listener={dailySalesChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>
                Análise Semanal: Mortes Absolutas
              </h4>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Atualizado: {data.timeLastUpdated.toString()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card chart>
            <CardHeader color='success'>
              <ChartistGraph
                className='ct-chart'
                data={buildBarChart([data.months_cases])}
                type='Bar'
                options={buildBarChartOptions([data.months_cases, ,])}
                responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                listener={emailsSubscriptionChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>Análise Mensal: Novos Casos</h4>
              <p className={classes.cardCategory}>
                Mês atual: {monthNumberToString(data.currentMonth)}{' '}
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Atualizado: {data.timeLastUpdated.toString()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card chart>
            <CardHeader color='success'>
              <ChartistGraph
                className='ct-chart'
                data={buildBarChart([data.months_deaths])}
                type='Bar'
                options={buildBarChartOptions([data.months_deaths])}
                responsiveOptions={emailsSubscriptionChart.responsiveOptions}
                listener={emailsSubscriptionChart.animation}
              />
            </CardHeader>
            <CardBody>
              <h4 className={classes.cardTitle}>
                Análise Mensal: Novas mortes
              </h4>
              <p className={classes.cardCategory}>
                Mês atual: {monthNumberToString(data.currentMonth)}{' '}
              </p>
            </CardBody>
            <CardFooter chart>
              <div className={classes.stats}>
                <AccessTime /> Atualizado: {data.timeLastUpdated.toString()}
              </div>
            </CardFooter>
          </Card>
        </GridItem>
      </GridContainer>

      <GridContainer>
        <GridItem xs={12} sm={12} md={12}>
          <Card>
            <CardHeader color='warning'>
              <h4 className={classes.cardTitleWhite}>Estado a estado</h4>
              <p className={classes.cardCategoryWhite}>
                Novos casos chegam todos os dias
              </p>
            </CardHeader>
            <CardBody>
              <Table
                tableHeaderColor='warning'
                tableHead={[
                  'Estado',
                  'Casos',
                  'Mortes',
                  'Novos Casos',
                  'Novas Mortes',
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
