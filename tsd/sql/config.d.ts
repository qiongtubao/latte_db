import { Config } from "../utils/pool";
export interface SQLCOnfig extends Config {
    host: string;
    user: string;
    password: string;
    database: string;
    port?: number;
    log: any;
}
