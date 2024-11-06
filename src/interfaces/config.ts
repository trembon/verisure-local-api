export default interface IConfig {
    server: IConfigServer;
    verisure: IConfigVerisure;
}

export interface IConfigServer {
    port: number;
}

export interface IConfigVerisure {
    username: string;
    password: string;
}

export function readConfig() : IConfig{
    return {
        server: {
          port: parseInt(readValue('SERVER_PORT', '3000')),
        },
        verisure: {
          username: readValue('VERISURE_USERNAME'),
          password: readValue('VERISURE_PASSWORD'),
        }
      }
}

function readValue(name: string, defaultValue?: string): string{
    const value = process.env[name];
    if(value) return value;
    if(defaultValue) return defaultValue;
    throw new Error(`config_missing: ${name}`);
}