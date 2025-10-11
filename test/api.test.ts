import request from "supertest";
import { describe, it } from "vitest";

import app from "../src/app.js";

describe("GET /issuance-management/issue?offset=0&limit=100", () => {
  it("responds with a json message", () =>
    request(app)
      .get("/issuance-management/issue?offset=0&limit=100")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200));
});

describe("GET /api/v1/emojis", () => {
  it("responds with a json message", () =>
    request(app)
      .get("/api/v1/emojis")
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200, ["😀", "😳", "🙄"]));
});
