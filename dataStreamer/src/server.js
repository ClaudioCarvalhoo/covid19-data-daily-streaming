const WebSocketServer = require('ws').Server;

const startServer = (port, path, dailyReports) => {
  const server = new WebSocketServer({ port: port, path: path });

  server.on('connection', webSocket => {
    let index = 0;
    const intervalId = setInterval(() => {
      sendOneRow(webSocket, dailyReports, index);
      index++;
      if (index >= dailyReports.length) {
        clearInterval(intervalId);
      }
    }, 50);
  });

  console.log(`Server listening at ${port}`);
};

const sendOneRow = (webSocket, dailyReports, index) => {
  const row = dailyReports[index];
  webSocket.send(JSON.stringify(row));
};

module.exports.startServer = startServer;
