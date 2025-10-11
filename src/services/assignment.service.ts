import type { CreateIssuerDto } from "../dto/create.dto";
import { IssuedDelivaryStatus } from "../enum/issued-status.js";
import { env } from "../env.js";
import { ApiError } from "../handler/api-error-handler.js";
import logger from "../utils/logger.js";
import { prisma } from "../utils/prisma.js";

export async function createAssignment(input: CreateIssuerDto) {
  const { id, username } = input;
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
    if (error.code === "P2002") {
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
  });
  const delivered = data.length;
  return { data, pagination: { offset, limit, total, delivered } };
}

export async function getAssignmentById(id: string) {
  return prisma.assignment.findUnique({ where: { id } });
}

export async function updateAssignmentStatus(id: string, status: string) {
  return prisma.assignment.update({
    where: { id },
    data: { issued_status: status, updated_at: BigInt(Date.now()) },
  });
}

export async function deleteAssignment(id: string) {
  return prisma.assignment.delete({
    where: { id },
  });
}
