const amqp = require("amqplib/callback_api");

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

    channel.consume(
      queue,
      function (report) {
        console.log(JSON.parse(report.content.toString()));
      },
      {
        noAck: true,
      }
    );
  });
});
