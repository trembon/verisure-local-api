declare module "verisure" {
  export interface VerisureOptions {
    username: string;
    password: string;
  }

  export interface Installation {
    giid: string;
    locale: string;
    client(options: QueryInstallationOptions): Promise<unknown>;
  }

  export interface QueryInstallationOptions {
    operationName: string;
    query: string;
  }

  export class Verisure {
    constructor(username: string, password: string);

    // Auth
    getToken(): Promise<void>;

    // Data
    getInstallations(): Promise<Installation[]>;

    // Control
    arm(giid: string): Promise<void>;
    disarm(giid: string): Promise<void>;
  }

  const verisure: {
    new (username: string, password: string): Verisure;
  };

  export default verisure;
}
