const amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', (error0, connection) => {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    const queue = 'dailyReports';
    channel.assertQueue(queue, { durable: true });

    channel.consume(
      queue,
      report => {
        console.log(JSON.parse(report.content.toString()));
      },
      { noAck: true }
    );
  });
});
