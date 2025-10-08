import type { CreateIssuerDto } from "@/dto/create.dto";

import express from "express";
import { createAssignment, getAssignments } from "@/services/assignment.service";

const router = express.Router();

router.post("/", async (req, res) => {
  const payload: CreateIssuerDto = req.body;
  const data = await createAssignment({
    id: payload.id,
    username: payload.username,
  });
  res.status(201).json({
    message: "Issuer created successfully",
    data,
  });
});

router.get("/", async (req, res) => {
  const offset = Number.parseInt(req.query.offset as string) || 0;
  const limit = Number.parseInt(req.query.limit as string) || 10;
  const data = await getAssignments(offset, limit);
  res.status(200).json({
    message: "Assignments fetched successfully",
    ...data,
  });
});

export default router;
