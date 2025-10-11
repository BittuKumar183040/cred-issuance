import type { Express } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger-spec.js";

export function setupSwagger(app: Express) {
  app.use("/issuance-management/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}
