import express from "express";
import IConfig, { readConfig } from "./interfaces/config";
import Verisure from "verisure";
import { fetchInstallation, queryInstallation } from "./fetch-data";
import "dotenv/config";

console.log("App :: Starting");

const app = express();

let config: IConfig;
try {
  config = readConfig();
  console.log("App :: Configuration loaded", config);
} catch (ex) {
  console.error("App :: Failed to read configuration variables", ex);
  process.exit();
}

async function main() {
  console.log("Verisure :: Authenticating");

  const verisure = new Verisure(
    config.verisure.username,
    config.verisure.password
  );
  try {
    await verisure.getToken();
    console.log("Verisure :: Authenticated successfully");
  } catch (ex) {
    console.error("Verisure :: Failed to authenticate", ex);
    process.exit();
  }

  const installation = await fetchInstallation(verisure);
  let state = await queryInstallation(installation);
  console.log("Verisure :: Initial state loaded");

  setInterval(async () => {
    console.log("Verisure :: Querying for updated state");
    state = await queryInstallation(installation);
  }, config.server.interval * 1000);

  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  app.get("/devices", (req, res) => {
    res.json(state);
  });

  app.listen(config.server.port, () => {
    return console.log(`App :: Started (http://*:${config.server.port})`);
  });
}

main();
