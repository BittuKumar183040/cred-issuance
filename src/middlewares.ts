import type { NextFunction, Request, Response } from "express";

import type ErrorResponse from "./handler/error-response.js";
import { env } from "./env.js";
import logger from "./utils/logger.js";

export function notFound(req: Request, res: Response, next: NextFunction) {
  res.status(404);
  logger.error(`🔍 - Not Found - ${req.originalUrl}`);
  const error = new Error(`🔍 - Not Found - ${req.originalUrl}`);
  next(error);
}

export function errorHandler(err: Error, req: Request, res: Response<ErrorResponse>, _next: NextFunction) {
  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode);
  logger.error(`❌ Unhandled error in ${req.method} : ${req.url} : ${err.message} : ${err.stack}`);
  res.json({
    message: err.message,
    stack: env.NODE_ENV === "production" ? "🥹" : err.stack,
  });
}
