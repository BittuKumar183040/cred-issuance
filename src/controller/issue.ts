import type { NextFunction, Request, Response } from "express";
import type { CreateIssuerDto } from "../dto/create.dto";
import type { IssuedDelivaryStatus } from "../enum/issued-status.js";
import express from "express";
import { createAssignment, deleteAssignment, getAssignmentById, getAssignments, updateAssignmentStatus } from "../services/assignment.service";
import logger from "../utils/logger.js";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload: CreateIssuerDto = req.body;

    const data = await createAssignment(payload);
    logger.info(`Issue created successfully`, data);
    return res.status(201).json(data);
  }
  catch (err) {
    next(err);
  }
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const offset = Number.parseInt(req.query.offset as string) || 0;
    const limit = Number.parseInt(req.query.limit as string) || 0;
    const { data, pagination: { total, delivered } } = await getAssignments(offset, limit);
    res.status(delivered === total ? 200 : 206).json({ data, total, delivered, offset, limit });
  }
  catch (err) { next(err); }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const assignment = await getAssignmentById(id);
    res.status(200).json(assignment);
  }
  catch (err) { next(err); }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const assignment = await deleteAssignment(id);
    logger.info(`${assignment.id} : Deleted Successfully`);
    res.status(204).json(assignment);
  }
  catch (err) {
    next(err);
  }
});

router.patch("/:id/status", async (req: Request<{ id: string }, any, any, { status: IssuedDelivaryStatus }>, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.query;
    const updated = await updateAssignmentStatus(id, status);
    logger.info(`${id} : Request updated Successfully : ${updated.issued_status}`);
    res.status(200).json(updated);
  }
  catch (err) { next(err); }
});

export default router;
