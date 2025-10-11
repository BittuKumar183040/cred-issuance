import type { CreateIssuerDto } from "../dto/create.dto";
import { IssuedDelivaryStatus } from "../enum/issued-status.js";
import { env } from "../env.js";
import { ApiError } from "../handler/api-error-handler.js";
import logger from "../utils/logger.js";
import { prisma } from "../utils/prisma.js";

export async function createAssignment(payload: CreateIssuerDto) {
  logger.info(`Incoming Issuer creation request`, { payload });

  if (!payload?.username) {
    logger.warn(`Missing username in request`);
    throw new ApiError(`Missing 'username' in request`, 400, "VALIDATION_ERROR");
  }

  const { id, username } = payload;
  const now = BigInt(Date.now());

  try {
    return await prisma.assignment.create({
      data: {
        id: id || crypto.randomUUID(),
        username,
        issued_by: env.WORKER_ID || "worker-1",
        issued_status: IssuedDelivaryStatus.SUBMITTED,
        issued_at: now,
        updated_at: now,
      },
    });
  }
  catch (error: any) {
    if (error.code === "P2002" || error.code === "P2003") {
      const fields = error.meta?.target || [];
      throw new ApiError(`The credential is already issued for ${fields.join(", ")}`, 409, "DUPLICATE_KEY");
    }

    throw new ApiError(error.message || "Internal server error", 500, "INTERNAL_ERROR");
  }
}

export async function getAssignments(offset = 0, limit = 0) {
  logger.info(`Fetching issuers`, { offset, limit });

  if (offset < 0) {
    throw new ApiError("Offset cannot be negative", 400, "VALIDATION_ERROR");
  }

  if (limit < 1 || limit > 100) {
    throw new ApiError("Limit must be between 0 and 100", 400, "VALIDATION_ERROR");
  }

  const total = await prisma.assignment.count();
  const data = await prisma.assignment.findMany({
    skip: offset,
    take: limit,
    orderBy: { issued_at: "desc" },
  });
  const delivered = data.length;
  return { data, pagination: { offset, limit, total, delivered } };
}

export async function getAssignmentById(id: string) {
  const data = await prisma.assignment.findUnique({ where: { id } });
  if (data) {
    return data;
  }
  throw new ApiError(`Assignment not found for id:${id} `, 404, "NOT_FOUND");
}

export async function updateAssignmentStatus(id: string, status: string) {
  if (!status) {
    throw new ApiError("Missing 'status' in request body", 400, "VALIDATION_ERROR");
  }
  if (!Object.values(IssuedDelivaryStatus).includes(status as IssuedDelivaryStatus)) {
    throw new ApiError(`Invalid 'status' value. Allowed values: ${Object.values(IssuedDelivaryStatus).join(", ")}`, 400, "VALIDATION_ERROR");
  }

  const data = await getAssignmentById(id);
  if (data) {
    return prisma.assignment.update({
      where: { id },
      data: { issued_status: status, updated_at: BigInt(Date.now()) },
    });
  }
  else {
    throw new ApiError(`Assignment not found for id:${id} `, 404, "NOT_FOUND");
  }
}

export async function deleteAssignment(id: string) {
  try {
    return await prisma.assignment.delete({ where: { id } });
  }
  catch (error: any) {
    if (error.code === "P2025") {
      throw new ApiError(`Assignment not found for id:${id} `, 404, "NOT_FOUND");
    }
    throw error;
  }
}
