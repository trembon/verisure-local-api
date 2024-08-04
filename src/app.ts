import express from 'express';
import fs from "fs";
import IConfig from './interfaces/config';
import Verisure from 'verisure';

const app = express();

let config: IConfig;
try {
    let rawdata = fs.readFileSync('config.json');
    config = JSON.parse(rawdata.toString());
} catch (ex) {
    console.error("Failed to read configuration file", ex);
    process.exit();
}

const verisure = new Verisure(config.verisure.username, config.verisure.password);

verisure.getToken()
  .then(() => verisure.getInstallations())
  .then((installations) => installations[0].client({
    operationName: 'Overview',
    query: `query Overview($giid: String!) {
      installation(giid: $giid) {
        alias
        locale

        climates {
          device {
            deviceLabel
            area
            gui {
              label
              __typename
            }
            __typename
          }
          humidityEnabled
          humidityTimestamp
          humidityValue
          temperatureTimestamp
          temperatureValue
          thresholds {
            aboveMaxAlert
            belowMinAlert
            sensorType
            __typename
          }
          __typename
        }

        armState {
          type
          statusType
          date
          name
          changedVia
          __typename
        }

        doorWindows {
          device {
            deviceLabel
            area
            gui {
              support
              label
              __typename
            }
            __typename
          }
          type
          state
          wired
          reportTime
          __typename
        }

        smartplugs {
          device {
            deviceLabel
            area
            gui {
              support
              label
              __typename
            }
            __typename
          }
          currentState
          icon
          isHazardous
          __typename
        }

        doorlocks {
          device {
            area
            deviceLabel
            __typename
          }
          currentLockState
          __typename
        }

        __typename
      }
    }`,
  }))
  .then((overview) => {
    console.log('Overview:', overview);
  })
  .catch((error) => {
    console.error(error);
  });

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(config.server.port, () => {
  return console.log(`Express is listening at http://localhost:${config.server.port}`);
});