import express from "express";
import * as dotenv from "dotenv";
import { getEnvVariable } from "./utils/getEnvVariable";
import DBService from "./services/DBService";
import BootstrapService from "./services/BootstrapService";

dotenv.config();

const port = process.env.PORT || parseInt(getEnvVariable("PORT"));

//service status the app needs to work with
interface IApplicationStatus {
    dbConnected: boolean;
}

class Application {

    private status: IApplicationStatus = {
        dbConnected: false,
    }

    checkStatus(): IApplicationStatus {
        return this.status;
    }


    async bootstrapMe(app: express.Express): Promise<boolean> {

        try {
            this.setBasic(app);
            await this.setUpDB(app);
            //bootstrap it all
            await this.bootMeUp();
            return true
        } catch (error) {
            return false;
        }

    }

    private async bootMeUp() {
        try {
            BootstrapService.initializeAdmin()
        } catch (error) {
            console.log("sorry we couldnt bootstrap the app")
            process.exit(0)
        }
        
    }

 
    

    private setBasic(app: express.Express) {
        app.use(express.json());
        app.enable("trust proxy"); // get client IP
    }

    private async setUpDB(app: express.Express) {
        try {
            await DBService.connect(getEnvVariable("APP_NAME"));
            this.status.dbConnected = true;
            this.startServer(app);
        } catch (error) {
            console.log("We are done! DB Connection failed ")
            process.exit(1)
        }

    }

    private startServer(app: express.Express) {
        app.listen(port, () => {
            console.log(`Server running on ${port}`);
        });
    }
}

export default Application;
