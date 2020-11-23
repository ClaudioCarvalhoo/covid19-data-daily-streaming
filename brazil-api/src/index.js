const fs = require('fs');
const http = require('http');
const express = require('express');
const csv = require('csv-parser');

const dailyReportRelativePath = './data/dailyReports.json';
const rawDailyReport = fs.readFileSync(dailyReportRelativePath);
const dailyReports = JSON.parse(rawDailyReport);

const shutdown = () => {
  console.log('Received kill signal, shutting down gracefully');
  fs.writeFile(dailyReportRelativePath, JSON.stringify(dailyReports), err => {
    if (err) throw err;
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

const brazilStates = {};

const startServer = () => {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  const setHeaders = res => {
    res.setHeader('Content-Type', 'text/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
  };

  app.get('/states', (_, res) => {
    setHeaders(res);
    res.status(200).json(brazilStates);
  });

  app.get('/state/:id/population', (req, res) => {
    setHeaders(res);
    const state = brazilStates[req.params.id];
    if (state) {
      res.status(200).json(state.population);
    } else {
      res.status(404).send(`Brazil's "${req.params.id}" state not found`);
    }
  });

  app.get('/daily-reports', (_, res) => {
    setHeaders(res);
    res.status(200).json(dailyReports);
  });

  const firstDateTime = new Date('2020-02-25').getTime();
  app.get('/months-report', (req, res) => {
    let reqDate = req.query.date;
    if (!req.query.date) {
      reqDate = new Date('2020-02-25');
      for (const i in dailyReports) {
        const curDateTime = new Date(dailyReports[i].date);
        reqDate =
          reqDate.getTime() < curDateTime.getTime() ? curDateTime : reqDate;
      }
    }

    const reqDateTime = new Date(reqDate).getTime();
    const differenceInTime = reqDateTime - firstDateTime;
    const daySinceStarted = differenceInTime / (1000 * 3600 * 24);

    const monthsCases = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    const monthsDeaths = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    for (const i in dailyReports) {
      const curDateTime = new Date(dailyReports[i].date).getTime();
      if (curDateTime <= reqDateTime) {
        const monthIndex = dailyReports[i].date.split('-')[1] - 1;
        const brazilReport = dailyReports[i].reports.BR;

        monthsCases[monthIndex] += brazilReport.cases;
        monthsDeaths[monthIndex] += brazilReport.deaths;
      }
    }

    setHeaders(res);
    res.status(200).json({
      daySinceStarted: daySinceStarted,
      report: { monthsCases, monthsDeaths },
    });
  });

  app.post('/daily-report', (req, res) => {
    const dailyReport = req.body;
    dailyReports.push(dailyReport);
    fs.writeFile(dailyReportRelativePath, JSON.stringify(dailyReports), err => {
      if (err) throw err;
    });

    setHeaders(res);
    res.sendStatus(200);
  });

  const server = http.createServer(app);
  server.listen(8080);

  console.log('Server listening on port 8080');
};

fs.createReadStream('./data/brazil_population_2019.csv')
  .pipe(csv({ separator: ';' }))
  .on('data', row => {
    const population = brazilStates[row.state]
      ? parseInt(brazilStates[row.state].population)
      : 0;

    brazilStates[row.state] = {
      population: population + parseInt(row.population),
    };
  })
  .on('end', () => startServer());
