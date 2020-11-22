const amqp = require('amqplib/callback_api');
const http = require('http');
const Subject = require('rxjs/Subject').Subject;
const fs = require('fs');

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

const addBrazil = (reports, reportList) => {
  let totalCases = 0;
  let totalDeaths = 0;
  for (const i in reportList) {
    totalCases += parseInt(reportList[i].cases);
    totalDeaths += parseInt(reportList[i].deaths);
  }

  reports.BR = {
    cases: totalCases,
    deaths: totalDeaths,
  };
};

const getPrevReport = date => {
  const d = new Date(date);
  d.setDate(d.getDate() - 1);
  const prevDate = d.toISOString().split('T')[0];

  const prev = dailyReports.find(dailyReport => dailyReport.date === prevDate);
  return prev ? prev.reports : null;
};

const parseDailyReport = (dailyReport, reportList) => {
  const curReport = dailyReport.reports;
  const prevReport = getPrevReport(dailyReport.date);

  for (const i in reportList) {
    const key = reportList[i].state;
    if (!curReport[key]) curReport[key] = {};

    curReport[key].cases = parseInt(reportList[i].cases);
    curReport[key].deaths = parseInt(reportList[i].deaths);

    if (prevReport) {
      curReport[key].newCases = reportList[i].cases - prevReport[key].cases;
      curReport[key].newDeaths = reportList[i].deaths - prevReport[key].deaths;
    } else {
      curReport[key].newCases = reportList[i].cases;
      curReport[key].newDeaths = reportList[i].deaths;
    }
  }

  if (prevReport) {
    curReport['BR'].newCases = curReport['BR'].cases - prevReport['BR'].cases;
    curReport['BR'].newDeaths =
      curReport['BR'].deaths - prevReport['BR'].deaths;
  } else {
    curReport['BR'].newCases = curReport['BR'].cases;
    curReport['BR'].newDeaths = curReport['BR'].deaths;
  }
};

const dailyReportSubject = new Subject();

amqp.connect('amqp://localhost', (err0, connection) => {
  if (err0) throw err0;

  connection.createChannel((err1, channel) => {
    if (err1) throw err1;

    const queue = 'dailyReports';
    channel.assertQueue(queue, { durable: true });
    channel.prefetch(1);

    channel.consume(
      queue,
      dailyReport => {
        dailyReportSubject.next(dailyReport.content);
        channel.ack(dailyReport);
      },
      { noAck: false }
    );
  });
});

const server = http.createServer((_, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  dailyReportSubject.subscribe(
    dailyReport => {
      const data = JSON.parse(dailyReport.toString());
      const reportList = data.reports;
      data.reports = {};

      addBrazil(data.reports, reportList);
      parseDailyReport(data, reportList);

      dailyReports.push(data);

      fs.writeFile(
        dailyReportRelativePath,
        JSON.stringify(dailyReports),
        err => {
          if (err) throw err;
        }
      );

      res.write(`data: ${JSON.stringify(data)}\n\n`);
    },
    err => console.log(err),
    () => console.log('Connection closed')
  );
});

server.listen(9090);
console.log('SSE-Server listening at 9090');
