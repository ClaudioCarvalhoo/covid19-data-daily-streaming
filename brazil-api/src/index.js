const http = require("http");
const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");

const brazilStates = {};

const startServer = () => {
  const app = express();
  app.use(express.json());

  const setHeaders = (res) => {
    res.setHeader("Content-Type", "text/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
  };

  app.get("/states", (req, res) => {
    setHeaders(res);
    res.status(200).json(brazilStates);
  });

  app.get("/state/:id/population", (req, res) => {
    setHeaders(res);
    const state = brazilStates[req.params.id];
    if (state) {
      res.status(200).json(state.population);
    } else {
      res.status(404).send(`Brazil's "${req.params.id}" state not found`);
    }
  });

  const server = http.createServer(app);
  server.listen(8080);

  console.log("Server listening on port 8080");
};

fs.createReadStream("./data/brazil_population_2019.csv")
  .pipe(csv({ separator: ";" }))
  .on("data", (row) => {
    const population = brazilStates[row.state]
      ? parseInt(brazilStates[row.state].population)
      : 0;

    brazilStates[row.state] = {
      population: population + parseInt(row.population),
    };
  })
  .on("end", () => startServer());
