const WebSocketServer = require("ws").Server;

function startServer(port, path, dailyInfo) {
  const server = new WebSocketServer({ port: port, path: path });

  server.on("connection", function (webSocket) {
    let index = 0;
    setInterval(() => {
      sendOneRow(webSocket, dailyInfo, index);
      index++;
    }, 2000);
  });
}

function sendOneRow(webSocket, dailyInfo, index) {
  let row = dailyInfo[index];
  webSocket.send(JSON.stringify(row));
}

module.exports.startServer = startServer;
