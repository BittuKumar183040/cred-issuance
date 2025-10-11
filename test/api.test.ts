import request from "supertest";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import app from "../src/app.js";
import * as service from "../src/services/assignment.service.js";

describe("POST /issuance-management/issue", () => {
  beforeEach(() => {
    vi.spyOn(service, "createAssignment").mockImplementation(async () => ({
      id: "test_001",
      username: "b2",
      issued_status: "CREATED",
      issued_by: "worker-1",
      issued_at: BigInt(1234),
      updated_at: BigInt(1234),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockPayload = {
    id: "test_001",
    username: "b2",
  };

  it("should return 201 and created assignment when valid payload is provided", async () => {
    const res = await request(app)
      .post("/issuance-management/issue")
      .send(mockPayload)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(201);

    const normalizedBody = {
      ...res.body,
      issued_at: BigInt(res.body.issued_at),
      updated_at: BigInt(res.body.updated_at),
    };

    expect(normalizedBody).toEqual({
      ...mockPayload,
      issued_status: "CREATED",
      issued_by: "worker-1",
      issued_at: BigInt(1234),
      updated_at: BigInt(1234),
    });

    expect(service.createAssignment).toHaveBeenCalledWith(mockPayload);
  });
});

describe("GET /issuance-management/issue?offset=0&limit=100", () => {
  it("should list issues", () =>
    request(app)
      .get("/issuance-management/issue?offset=0&limit=100")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200));
});

describe("GET /issuance-management/issue/:id", () => {
  const testId = "21";
  const mockAssignment = {
    id: testId,
    username: "b2",
    issued_status: "SUBMITTED",
    issued_by: "worker-1",
    issued_at: BigInt(1234),
    updated_at: BigInt(1234),
  };

  beforeEach(() => {
    vi.spyOn(service, "getAssignmentById").mockResolvedValue(mockAssignment);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 200 and the assignment when found", async () => {
    const res = await request(app)
      .get(`/issuance-management/issue/${testId}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    const normalizedBody = {
      ...res.body,
      issued_at: BigInt(res.body.issued_at),
      updated_at: BigInt(res.body.updated_at),
    };

    expect(normalizedBody).toEqual(mockAssignment);
  });
});

describe("DELETE /issuance-management/issue/:id", () => {
  const testId = "test_id";

  const mockAssignment = {
    id: "test_id",
    username: "b2",
    issued_status: "SUBMITTED",
    issued_by: "worker-1",
    issued_at: BigInt(1234),
    updated_at: BigInt(1234),
  };

  beforeEach(() => {
    vi.spyOn(service, "deleteAssignment").mockImplementation(async (id) => {
      if (id === mockAssignment.id) {
        return mockAssignment;
      }
      throw new Error("Assignment not found");
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 204 when the assignment is successfully deleted", async () => {
    await request(app)
      .delete(`/issuance-management/issue/${testId}`)
      .set("Accept", "application/json")
      .expect(204);

    expect(service.deleteAssignment).toHaveBeenCalledWith(testId);
  });
});

describe("PATCH /issuance-management/issue/:id/status", () => {
  const testId = "21";
  const newStatus = "DELIVERED";

  const mockAssignment = {
    id: testId,
    username: "b2",
    issued_status: newStatus,
    issued_by: "worker-1",
    issued_at: BigInt(1234),
    updated_at: BigInt(5678),
  };

  beforeEach(() => {
    vi.spyOn(service, "updateAssignmentStatus").mockResolvedValue(mockAssignment);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should return 200 and updated assignment when status is updated successfully", async () => {
    const res = await request(app)
      .patch(`/issuance-management/issue/${testId}/status?status=${newStatus}`)
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200);

    const normalizedBody = {
      ...res.body,
      issued_at: BigInt(res.body.issued_at),
      updated_at: BigInt(res.body.updated_at),
    };

    expect(normalizedBody).toEqual(mockAssignment);
    expect(service.updateAssignmentStatus).toHaveBeenCalledWith(testId, newStatus);
  });
});
