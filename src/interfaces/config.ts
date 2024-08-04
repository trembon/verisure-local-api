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