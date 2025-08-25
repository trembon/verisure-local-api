export default interface IConfig {
  server: IConfigServer;
  verisure: IConfigVerisure;
  webhooks: IConfigWebhooks;
}

export interface IConfigServer {
  port: number;
  interval: number;
}

export interface IConfigVerisure {
  username: string;
  password: string;
}

export interface IConfigWebhooks {
  sensorUpdates: string;
  deviceUpdates: string;
}

export function readConfig(): IConfig {
  return {
    server: {
      port: parseInt(readValue("SERVER_PORT", "3000")),
      interval: parseInt(readValue("SERVER_INTERVAL", (5 * 60).toString())),
    },
    verisure: {
      username: readValue("VERISURE_USERNAME"),
      password: readValue("VERISURE_PASSWORD"),
    },
    webhooks: {
      sensorUpdates: readValue("WEBHOOK_SENSOR_UPDATES"),
      deviceUpdates: readValue("WEBHOOK_DEVICE_UPDATES"),
    },
  };
}

function readValue(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (value) return value;
  if (defaultValue) return defaultValue;
  throw new Error(`config_missing: ${name}`);
}
