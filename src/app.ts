import express from "express";
import IConfig, { readConfig } from "./interfaces/config";
import Verisure, { Installation } from "verisure";
import { fetchInstallation, queryInstallation } from "./fetch-data";
import "dotenv/config";
import { detectUpdates } from "./detect-updates";
import { sendToWebhook } from "./send-webhook";
import { IDeviceResponse } from "./interfaces/device";
import { VerisureRoot } from "./interfaces/verisure";

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

  let installation: Installation;
  let state: VerisureRoot;
  try {
    installation = await fetchInstallation(verisure);
    state = await queryInstallation(installation);
    console.log("Verisure :: Initial state loaded");
  } catch (ex) {
    console.error("Verisure :: Failed to fetch initial state", ex);
    process.exit();
  }

  setInterval(async () => {
    console.log("Verisure :: Querying for updated state");
    const newState = await queryInstallation(installation);
    var changes = detectUpdates(state, newState);
    state = newState;

    if (changes.armStates.length > 0 && config.webhooks.deviceUpdates) {
      await sendToWebhook(config.webhooks.deviceUpdates, {
        id: installation.giid,
        state: changes.armStates[0].statusType,
        changedAt: changes.armStates[0].date,
        by: changes.armStates[0].changedVia,
      });
    }
    if (changes.doorWindows.length > 0 && config.webhooks.deviceUpdates) {
      changes.doorWindows.forEach(async (device) => {
        await sendToWebhook(config.webhooks.deviceUpdates, {
          id: device.device.deviceLabel,
          state: device.state,
          changedAt: device.reportTime,
          by: null,
        });
      });
    }
    if (changes.climates.length > 0 && config.webhooks.sensorUpdates) {
      changes.climates.forEach(async (climate) => {
        await sendToWebhook(config.webhooks.sensorUpdates, climate);
      });
    }
    console.log("App :: update processed", changes);
  }, config.server.interval * 1000);

  app.get("/", (req, res) => {
    res.json([
      {
        url: "/devices",
        method: "GET",
        info: "List all devices",
      },
    ]);
  });

  app.get("/devices", (req, res) => {
    const response: IDeviceResponse[] = [];
    response.push({
      id: installation.giid,
      name: state.installation.alias,
      type: "Installation",
      state: state.installation.armState.statusType,
    });

    state.installation.climates.forEach((climate) => {
      response.push({
        id: climate.device.deviceLabel,
        name: climate.device.area,
        type: climate.device.gui.label,
      });
    });

    state.installation.doorWindows.forEach((doorWindow) => {
      response.push({
        id: doorWindow.device.deviceLabel,
        name: doorWindow.device.area,
        type: doorWindow.device.gui.label,
        state: doorWindow.state,
      });
    });

    res.json(response);
  });

  app.listen(config.server.port, () => {
    return console.log(`App :: Started (http://*:${config.server.port})`);
  });
}

main();
