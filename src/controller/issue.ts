import type { NextFunction, Request, Response } from "express";
import type { CreateIssuerDto } from "../dto/create.dto";
import express from "express";
import { IssuedDelivaryStatus } from "../enum/issued-status.js";
import { ApiError } from "../handler/api-error-handler.js";
import { createAssignment, deleteAssignment, getAssignmentById, getAssignments, updateAssignmentStatus } from "../services/assignment.service";
import logger from "../utils/logger.js";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload: CreateIssuerDto = req.body;

    logger.info(`Incoming Issuer creation request`, { payload });

    if (!payload?.username) {
      logger.warn(`Missing username in request`);
      throw new ApiError(`Missing 'username' in request`, 400, "VALIDATION_ERROR");
    }

    const data = await createAssignment(payload);

    logger.info(`Issue created successfully`, { id: data.id });
    return res.status(201).json({ message: "Issue created successfully", data });
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

    if (!status) {
      throw new ApiError("Missing 'status' in request body", 400, "VALIDATION_ERROR");
    }
    if (!Object.values(IssuedDelivaryStatus).includes(status as IssuedDelivaryStatus)) {
      throw new ApiError(`Invalid 'status' value. Allowed values: ${Object.values(IssuedDelivaryStatus).join(", ")}`, 400, "VALIDATION_ERROR");
    }

    const updated = await updateAssignmentStatus(id, status);
    logger.info(`${id} : Request updated Successfully : ${updated.issued_status}`);
    res.status(200).json(updated);
  }
  catch (err) { next(err); }
});

export default router;
