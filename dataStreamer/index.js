const csv = require("csv-parser");
const fs = require("fs");
const { startServer } = require("./server");

let dailyInfo = [];
fs.createReadStream("./data/brazil_covid19.csv")
  .pipe(csv())
  .on("data", (row) => dailyInfo.push(row))
  .on("end", () => {
    startServer(7474, "/test", dailyInfo);
  });
