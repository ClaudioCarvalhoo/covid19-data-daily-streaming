const amqp = require('amqplib/callback_api');
const http = require('http');
const Subject = require('rxjs/Subject').Subject;

const addBrazil = report => {
  let totalCases = 0;
  let totalDeaths = 0;
  for (const key in report) {
    totalCases += parseInt(report[key].cases);
    totalDeaths += parseInt(report[key].deaths);
  }

  report.BR = {
    cases: totalCases,
    deaths: totalDeaths,
  };
};

let prevReport = null;
const parseReport = curReport => {
  for (const key in curReport) {
    curReport[key].cases = parseInt(curReport[key].cases);
    curReport[key].deaths = parseInt(curReport[key].deaths);

    if (prevReport) {
      curReport[key].newCases = curReport[key].cases - prevReport[key].cases;
      curReport[key].newDeaths = curReport[key].deaths - prevReport[key].deaths;
    } else {
      curReport[key].newCases = curReport[key].cases;
      curReport[key].newDeaths = curReport[key].deaths;
    }

    prevReport = curReport;
  }
};

const dailyReportSubject = new Subject();

amqp.connect('amqp://localhost', (err0, connection) => {
  if (err0) throw err0;

  connection.createChannel((err1, channel) => {
    if (err1) throw err1;

    const queue = 'dailyReports';
    channel.assertQueue(queue, { durable: true });

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
  res.writeHeader(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  dailyReportSubject.subscribe(
    dailyReport => {
      const data = JSON.parse(dailyReport.toString());
      addBrazil(data.report);
      parseReport(data.report);
      res.write(JSON.stringify(data));
    },
    err => console.log(err),
    () => console.log('Connection closed')
  );
});

server.listen(9090);
console.log('SSE-Server listening at 9090');
