const amqp = require('amqplib/callback_api');
const http = require('http');
const Subject = require('rxjs/Subject').Subject;

const RABBITMQ_SERVER_ADDR = process.env.RABBITMQ_SERVER_ADDR
  ? process.env.RABBITMQ_SERVER_ADDR
  : 'localhost';

const BRAZIL_API_ADDR = process.env.BRAZIL_API_ADDR
  ? process.env.BRAZIL_API_ADDR
  : 'localhost';

let dailyReports = [];
http
  .get(`http://${BRAZIL_API_ADDR}:8080/daily-reports`, res => {
    let data = '';
    res.on('data', chunk => {
      data += chunk;
    });

    res.on('end', () => {
      dailyReports = JSON.parse(data);
    });
  })
  .on('error', err => {
    throw err;
  });

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

const next = dailyReport => {
  const data = JSON.parse(dailyReport.toString());
  const reportList = data.reports;
  data.reports = {};

  addBrazil(data.reports, reportList);
  parseDailyReport(data, reportList);

  dailyReports.push(data);
  dailyReportSubject.next(JSON.stringify(data));
};

// send data to brazil-api
dailyReportSubject.subscribe(
  dailyReport => {
    const options = {
      hostname: BRAZIL_API_ADDR,
      port: 8080,
      path: '/daily-report',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, _ => {});
    req.on('error', error => {
      throw error;
    });

    req.write(dailyReport);
    req.end();
  },
  err => {
    throw err;
  },
  () => console.log('Connection closed')
);

// sse server
const server = http.createServer((_, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  dailyReportSubject.subscribe(
    dailyReport => {
      res.write(`data: ${dailyReport}\n\n`);
    },
    err => {
      throw err;
    },
    () => console.log('Connection closed')
  );
});

server.listen(9090);
console.log('SSE-Server listening at 9090');

// rabbitmq consumer
amqp.connect(`amqp://${RABBITMQ_SERVER_ADDR}`, (err0, connection) => {
  if (err0) throw err0;

  connection.createChannel((err1, channel) => {
    if (err1) throw err1;

    const queue = 'dailyReports';
    channel.assertQueue(queue, { durable: true });
    channel.prefetch(1);

    channel.consume(
      queue,
      dailyReport => {
        next(dailyReport.content);
        channel.ack(dailyReport);
      },
      { noAck: false }
    );
  });
});
