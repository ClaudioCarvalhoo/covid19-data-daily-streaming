const WebSocketServer = require("ws").Server;

function startServer(port, path, dailyReports) {
  const server = new WebSocketServer({ port: port, path: path });

  server.on("connection", function (webSocket) {
    let index = 0;
    setInterval(() => {
      sendOneRow(webSocket, dailyReports, index);
      index++;
    }, 2000);
  });
}

function sendOneRow(webSocket, dailyReports, index) {
  let row = dailyReports[index];
  webSocket.send(JSON.stringify(row));
}

module.exports.startServer = startServer;
