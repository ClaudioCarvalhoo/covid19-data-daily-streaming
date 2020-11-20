const WebSocket = require("ws");
const states = require("./states");
const rxjsWebSocket = require("rxjs/webSocket").webSocket;
const filter = require("rxjs/operators").filter;
const Subject = require("rxjs/Subject").Subject;
var amqp = require("amqplib/callback_api");

let dailyReports = {};
let nextDay = new Date("2020-02-25");

const reportsWebSocketSubject = rxjsWebSocket({
  url: "ws://localhost:7474/reports",
  WebSocketCtor: WebSocket,
});

let dailyReportsSubject = new Subject();
dailyReportsSubject = dailyReportsSubject.pipe(
  filter(
    (reportInDate) =>
      new Date(reportInDate.date).getTime() === nextDay.getTime() &&
      Object.keys(reportInDate.report).length === states.length
  )
);

reportsWebSocketSubject.subscribe(
  (report) => {
    dailyReports[report.date] = {
      ...dailyReports[report.date],
      [report.state]: { cases: report.cases, deaths: report.deaths },
    };
    dailyReportsSubject.next({
      date: report.date,
      report: dailyReports[report.date],
    });
  },
  (err) => {
    console.log(err);
  },
  () => console.log("Connection closed")
);

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    var queue = "dailyReports";
    channel.assertQueue(queue, {
      durable: true,
    });

    dailyReportsSubject.subscribe(
      (reportInDate) => {
        nextDay.setDate(nextDay.getDate() + 1);
        /*
            Topic is going to get messy with duplicate messages from previous runs.
            Find a way to ignore or update them using date as a key
        */
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(reportInDate)));
      },
      (err) => {
        console.log(err);
      },
      () => console.log("Subject closed")
    );
  });
});
