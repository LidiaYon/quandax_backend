import * as bluebird from "bluebird";
import * as mongoose from "mongoose";
import {ConnectOptions, Mongoose} from "mongoose";


import { getEnvVariable } from "../utils/getEnvVariable";
import { Environments } from "../types/common.types";



const ENVIRONMENT = getEnvVariable("ENVIRONMENT");
const DB_URL = getEnvVariable("DB_URL") || "";

export class DBService {
    private connection : typeof mongoose | undefined;
    private mongooseInstance: Mongoose;

    constructor() {
        this.mongooseInstance = mongoose;
        this.mongooseInstance.Promise = bluebird;
    }

    public getInstance(): Mongoose {
        return this.mongooseInstance;
    }

    public async connect(callingApp: string): Promise<void> {
        const dbName = `${callingApp}_${ENVIRONMENT}`;

        if (ENVIRONMENT !== Environments.PRODUCTION) {
            mongoose.set("debug", (coll: any, method: any, query: any, doc: any, opts: any) => {
             /*
                logger.info({
                    dbQuery: {
                        coll,
                        method,
                        query,
                        doc,
                        options: opts
                    }
                });
                */
            });
        }
       
        const options: ConnectOptions = {
            retryWrites: true,
            ssl: true,
            w: "majority" as const,
            authSource: "admin",
            tlsInsecure: true,
            dbName,
        };

        try {
            await this.mongooseInstance.connect(DB_URL, options);
            console.log("Connected to MongoDB");
        } catch (err) {
            console.error("Error connecting to MongoDB:", err);
            throw err;
        }
    }

    public async disconnect(): Promise<void> {
        await this.mongooseInstance.disconnect();
        console.log("Disconnected from MongoDB");
    }

    public useCon() : typeof mongoose | undefined {
        return this.connection;
    }

    //TODO: We can intiialie our db if necessary here
    private async initialize(): Promise<void> {
        try {
            console.log("we can initialize db things here.");
        } catch (error) {
            process.exit(1);
        }
    }
}

export default new DBService();