import type { Request, Response } from "express";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import api from "./controller/issue.js";
import * as middlewares from "./middlewares.js";
import { checkDatabaseConnection } from "./utils/check-dbconn.js";
import { setupSwagger } from "./utils/swagger/swagger.js";
import "./services/verfication-scheduler.js";

const app = express();

setupSwagger(app);
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/", (_req: Request, res: Response) => {
  res.send(`
    <h1>Welcome to Issuance Management API</h1>
    <p>API Documentation: <a href="/issuance-management/docs">/docs</a></p>
    <p>Health Check Endpoint: <a href="/issuance-management/health">/issuance-management/health</a></p>
  `);
});

app.get("/issuance-management/health", async (_req: Request, res: Response) => {
  const status = await checkDatabaseConnection();
  res.status(status.code).json(status);
});

app.use("/issuance-management/issue", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
