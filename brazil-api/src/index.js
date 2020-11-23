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
