import type { CreateIssuerDto } from "../../src/dto/create.dto.js";
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import { IssuedDelivaryStatus } from "../../src/enum/issued-status.js";
import { createAssignment, deleteAssignment, getAssignmentById, getAssignments } from "../../src/services/assignment.service.js";
import { prisma } from "../../src/utils/prisma.js";

describe("createAssignment", () => {
  const mockCreate = vi.fn();
  prisma.assignment.create = mockCreate;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should create an assignment successfully", async () => {
    mockCreate.mockImplementation(async args => ({ data: { ...args.data } }));

    const result = await createAssignment({ id: "test-uuid", username: "b2" } as CreateIssuerDto);
    expect(result).toEqual({
      data: {
        id: "test-uuid",
        username: "b2",
        issued_by: "worker-1",
        issued_status: IssuedDelivaryStatus.SUBMITTED,
        issued_at: expect.any(Number),
        updated_at: expect.any(Number),
      },
    });
  });
});

describe("getAssignments", () => {
  const mockCount = vi.fn();
  const mockFindMany = vi.fn();

  prisma.assignment.count = mockCount;
  prisma.assignment.findMany = mockFindMany;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should return assignments with pagination successfully", async () => {
    const offset = 0;
    const limit = 2;

    const mockData = [
      {
        id: "test-1",
        username: "b1",
        issued_by: "worker-1",
        issued_status: IssuedDelivaryStatus.SUBMITTED,
        issued_at: 1234,
        updated_at: 1234,
      },
      {
        id: "test-2",
        username: "b2",
        issued_by: "worker-2",
        issued_status: IssuedDelivaryStatus.SUBMITTED,
        issued_at: 1235,
        updated_at: 1235,
      },
    ];

    mockCount.mockResolvedValue(5);
    mockFindMany.mockResolvedValue(mockData);

    const result = await getAssignments(offset, limit);

    expect(result).toEqual({
      data: mockData,
      pagination: {
        offset,
        limit,
        total: 5,
        delivered: mockData.length,
      },
    });

    expect(mockCount).toHaveBeenCalled();
    expect(mockFindMany).toHaveBeenCalledWith({
      skip: offset,
      take: limit,
      orderBy: { issued_at: "desc" },
    });
  });
});

describe("getAssignmentById", () => {
  const mockFindUnique = vi.fn();
  prisma.assignment.findUnique = mockFindUnique;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should return the assignment when it exists", async () => {
    const testId = "test-uuid";
    const mockAssignment = {
      id: testId,
      username: "b2",
      issued_by: "worker-1",
      issued_status: IssuedDelivaryStatus.SUBMITTED,
      issued_at: 1234,
      updated_at: 1234,
    };

    mockFindUnique.mockResolvedValue(mockAssignment);

    const result = await getAssignmentById(testId);

    expect(result).toEqual(mockAssignment);
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { id: testId } });
  });
});

describe("deleteAssignment", () => {
  const mockDelete = vi.fn();
  prisma.assignment.delete = mockDelete;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  it("should delete the assignment and return it when it exists", async () => {
    const testId = "test-uuid";

    const mockAssignment = {
      id: testId,
      username: "b2",
      issued_by: "worker-1",
      issued_status: IssuedDelivaryStatus.SUBMITTED,
      issued_at: 1234,
      updated_at: 1234,
    };

    mockDelete.mockResolvedValue(mockAssignment);

    const result = await deleteAssignment(testId);

    expect(result).toEqual(mockAssignment);
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: testId } });
  });
});
