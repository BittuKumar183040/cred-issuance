import type { CreateIssuerDto } from "../dto/create.dto";
import express from "express";
import { createAssignment, getAssignments } from "../services/assignment.service";
import logger from "../utils/logger.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const payload: CreateIssuerDto = req.body;
  const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  logger.info(`[${requestId}] Incoming Issuer creation request`, { payload });

  const data = await createAssignment({
    id: payload.id,
    username: payload.username,
  });

  logger.info(`[${requestId}] Issuer created successfully`, { id: data.id });
  res.status(201).json({
    message: "Issuer created successfully",
    data,
  });
});

router.get("/", async (req, res) => {
  const offset = Number.parseInt(req.query.offset as string) || 0;
  const limit = Number.parseInt(req.query.limit as string) || 10;
  const requestId = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  logger.info(`[${requestId}] Fetching issuers`, { offset, limit });

  const data = await getAssignments(offset, limit);

  logger.info(`[${requestId}] Issuers fetched successfully`, { count: data.data?.length || 0 });
  res.status(200).json({
    message: "Assignments fetched successfully",
    ...data,
  });
});

export default router;
