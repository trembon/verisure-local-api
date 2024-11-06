import express from 'express';
import IConfig, { readConfig } from './interfaces/config';
import Verisure from 'verisure';

const app = express();

let config: IConfig;
try {
    config = readConfig();
} catch (ex) {
    console.error("Failed to read configuration variables", ex);
    process.exit();
}

console.log('config', config);

/*const verisure = new Verisure(config.verisure.username, config.verisure.password);

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

        __typename
      }
    }`,
  }))
  .then((overview) => {
    console.log('Overview:');
    console.dir(overview, { depth: null })
  })
  .catch((error) => {
    console.error(error);
  });
*/
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(config.server.port, () => {
  return console.log(`Express is listening at http://localhost:${config.server.port}`);
});