import type { CreateIssuerDto } from "@/dto/create.dto";
import { IssuedDelivaryStatus } from "@/enum/issued-status";
import { env } from "@/env";
import { prisma } from "@/utils/prisma";

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
      throw new Error(`Duplicate key error on fields: ${fields.join(", ")}`);
    }

    throw new Error(error.message || "Internal server error");
  }
}

export async function getAssignments(offset = 0, limit = 10) {
  const total = await prisma.assignment.count();
  const data = await prisma.assignment.findMany({
    skip: offset,
    take: limit,
  });
  return { data, pagination: { offset, limit, total } };
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
