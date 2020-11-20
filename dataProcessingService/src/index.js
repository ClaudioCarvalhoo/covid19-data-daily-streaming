const amqp = require('amqplib/callback_api');
const http = require('http');
const Subject = require('rxjs/Subject').Subject;

let prevReport = {
  BR: { cases: 0, deaths: 0 },
  DF: { cases: 0, deaths: 0 },
  GO: { cases: 0, deaths: 0 },
  MS: { cases: 0, deaths: 0 },
  MT: { cases: 0, deaths: 0 },
  AL: { cases: 0, deaths: 0 },
  BA: { cases: 0, deaths: 0 },
  CE: { cases: 0, deaths: 0 },
  MA: { cases: 0, deaths: 0 },
  PB: { cases: 0, deaths: 0 },
  PE: { cases: 0, deaths: 0 },
  PI: { cases: 0, deaths: 0 },
  RN: { cases: 0, deaths: 0 },
  SE: { cases: 0, deaths: 0 },
  AC: { cases: 0, deaths: 0 },
  AM: { cases: 0, deaths: 0 },
  AP: { cases: 0, deaths: 0 },
  PA: { cases: 0, deaths: 0 },
  RO: { cases: 0, deaths: 0 },
  RR: { cases: 0, deaths: 0 },
  TO: { cases: 0, deaths: 0 },
  ES: { cases: 0, deaths: 0 },
  MG: { cases: 0, deaths: 0 },
  RJ: { cases: 0, deaths: 0 },
  SP: { cases: 0, deaths: 0 },
  PR: { cases: 0, deaths: 0 },
  RS: { cases: 0, deaths: 0 },
  SC: { cases: 0, deaths: 0 },
};

const parseReport = curReport => {
  for (const key in curReport) {
    curReport[key].cases = parseInt(curReport[key].cases);
    curReport[key].deaths = parseInt(curReport[key].deaths);
    curReport[key].newCases = curReport[key].cases - prevReport[key].cases;
    curReport[key].newDeaths = curReport[key].deaths - prevReport[key].deaths;
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
      parseReport(data.report);
      prevReport = data.report;
      res.write(JSON.stringify(data));
    },
    err => console.log(err),
    () => console.log('Connection closed')
  );
});

server.listen(9090);
console.log('SSE-Server listening at 9090');
