import express, { NextFunction, Response, Request } from "express";
import cors from "cors";
import path from 'path';
import Application from "./Application";
import { getEnvVariable } from "./utils/getEnvVariable";
import authRouter from "./routes/authRoutes"
import courseRoutes from "./routes/courseRoutes";
import userRoutes from "./routes/userRoutes";
import enrollmentRoutes from "./routes/enrollmentRoutes";
import assignmentRoutes from "./routes/assignmentRoutes"

import { ErrorHandler } from "./middleware/ErrorHandler";


const application = new Application();


const app = express();


app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Create upload directories if they don't exist
import fs from 'fs';
const uploadDirs = ['uploads/videos', 'uploads/pdfs'];
uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

let BASE_API = getEnvVariable("API_BASE");
if (!BASE_API.endsWith("/")) {
  BASE_API = BASE_API + "/";
}

app.use(`${BASE_API}auth`, authRouter);
app.use(`${BASE_API}courses`, courseRoutes);
app.use(`${BASE_API}users`, userRoutes);
app.use(`${BASE_API}enrollments`, enrollmentRoutes);
app.use(`${BASE_API}assignments`, assignmentRoutes);



app.route(`${BASE_API}health`).get(async (req, res) => {
  res.status(200).send("Health Check Passed");
});


app.route("/").get((req, res) => {
  res.status(404).send("Page not found");
});



app.use((err: any, req: any, res: any, next: any) => {
  console.log('Pre-error handler middleware caught:', err);
  next(err);
});

app.use(ErrorHandler);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// Move the server startup logic inside this function
const startServer = async () => {
  try {
    await application.bootstrapMe(app);
      
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();
