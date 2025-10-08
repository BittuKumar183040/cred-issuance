import type { Request, Response } from "express";

import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import api from "@/controller/issue.js";
import * as middlewares from "@/middlewares";
import { checkDatabaseConnection } from "@/utils/check-dbconn";

const app = express();

app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get("/health", async (_req: Request, res: Response) => {
  const status = await checkDatabaseConnection();
  res.status(status.code).json(status);
});

(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

app.use("/", api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
