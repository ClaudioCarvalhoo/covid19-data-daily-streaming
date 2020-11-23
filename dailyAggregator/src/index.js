const WebSocket = require('ws');
const rxjsWebSocket = require('rxjs/webSocket').webSocket;
const { groupBy, mergeMap, bufferCount, map } = require('rxjs/operators');
const amqp = require('amqplib/callback_api');
const states = require('./states');
const _ = require('lodash');
const TinyQueue = require('tinyqueue');

const STREAMER_ADDR = process.env.STREAMER_ADDR
  ? process.env.STREAMER_ADDR
  : 'localhost';

const RABBITMQ_SERVER_ADDR = process.env.RABBITMQ_SERVER_ADDR
  ? process.env.RABBITMQ_SERVER_ADDR
  : 'localhost';

let nextDay = new Date('2020-02-25');
let reportsHeap = new TinyQueue(
  [],
  (a, b) => new Date(a.date) - new Date(b.date)
);

const reportsWebSocketSubject = rxjsWebSocket({
  url: `ws://${STREAMER_ADDR}:7474/reports`,
  WebSocketCtor: WebSocket,
});

const grouped = reportsWebSocketSubject.pipe(
  groupBy(report => report.date),
  mergeMap(report => report.pipe(bufferCount(states.length))),
  map(reports => ({
    date: reports[0].date,
    reports: reports.map(report => _.omit(report, 'date')),
  }))
);

amqp.connect(`amqp://${RABBITMQ_SERVER_ADDR}`, (error0, connection) => {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    const queue = 'dailyReports';
    channel.assertQueue(queue, { durable: true });

    grouped.subscribe(
      report => {
        reportsHeap.push(report);
        while (
          reportsHeap.peek() &&
          new Date(reportsHeap.peek().date).getTime() === nextDay.getTime()
        ) {
          channel.sendToQueue(
            queue,
            Buffer.from(JSON.stringify(reportsHeap.pop()))
          );
          nextDay.setDate(nextDay.getDate() + 1);
        }
      },
      err => {
        throw err;
      },
      () => console.log('Subject closed')
    );

    console.log('Consuming from "dailyReports" queue');
  });
});
