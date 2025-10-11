import type { OpenAPIV3 } from "openapi-types";

const schemas: OpenAPIV3.ComponentsObject["schemas"] = {
  CreateIssuerDto: {
    type: "object",
    properties: {
      id: {
        type: "string",
        description: "Optional ID, generated if not provided",
      },
      username: { type: "string", description: "Username of the issuer" },
    },
    required: ["username"],
  },
  Assignment: {
    type: "object",
    properties: {
      id: { type: "string" },
      username: { type: "string" },
      issued_by: { type: "string" },
      issued_status: { type: "string" },
      issued_at: { type: "integer" },
      updated_at: { type: "integer" },
    },
  },
  AssignmentsResponse: {
    type: "object",
    properties: {
      data: {
        type: "array",
        items: { $ref: "#/components/schemas/Assignment" },
      },
      total: { type: "integer" },
      delivered: { type: "integer" },
      offset: { type: "integer" },
      limit: { type: "integer" },
    },
  },
  MessageResponse: {
    type: "object",
    properties: {
      message: { type: "string" },
    },
  },
};

const paths: OpenAPIV3.PathsObject = {
  "/issuance-management/issue": {
    post: {
      tags: ["Issuance"],
      summary: "Submit a new Issuer",
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateIssuerDto" },
          },
        },
      },
      responses: {
        201: {
          description: "Issuer created successfully",
          content: {
            "application/json": {
              schema: {
                $ref: "#/components/schemas/AssignmentsResponse",
              },
            },
          },
        },
        400: {
          description: "VALIDATION_ERROR",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessageResponse" },
            },
          },
        },
        409: {
          description: "DUPLICATE_KEY",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "The credential is already issued from: username",
                  },
                },
              },
            },
          },
        },
        500: {
          description: "INTERNAL_ERROR",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string", example: "Internal server error" },
                },
              },
            },
          },
        },
      },
    },
    get: {
      tags: ["Issuance"],
      summary: "Fetch issuers",
      parameters: [
        {
          in: "query",
          name: "offset",
          schema: { type: "integer", default: 0 },
          description: "Number of items to skip",
        },
        {
          in: "query",
          name: "limit",
          schema: { type: "integer", default: 10 },
          description: "Max number of items",
        },
      ],
      responses: {
        200: {
          description: "All assignments delivered",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AssignmentsResponse" },
            },
          },
        },
        206: {
          description: "Partial assignments delivered",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AssignmentsResponse" },
            },
          },
        },
        400: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessageResponse" },
            },
          },
        },
      },
    },
  },
  "/issuance-management/issue/{id}": {
    get: {
      tags: ["Issuance"],
      summary: "Fetch issuers by Id",
      parameters: [
        {
          in: "path",
          name: "id",
          schema: { type: "string" },
          required: true,
          description: "The ID of the assignment",
          example: "123e4567-e89b-12d3-a456-426614174000",
        },
      ],
      responses: {
        200: {
          description: "All assignments delivered",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AssignmentsResponse" },
            },
          },
        },
        404: {
          description: "Assignment not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessageResponse" },
            },
          },
        },
        400: {
          description: "Validation error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessageResponse" },
            },
          },
        },
      },
    },
    delete: {
      tags: ["Issuance"],
      summary: "Fetch issuers by Id",
      parameters: [
        {
          in: "path",
          name: "id",
          schema: { type: "string" },
          required: true,
          description: "The ID of the assignment",
          example: "123e4567-e89b-12d3-a456-426614174000",
        },
      ],
      responses: {
        204: {
          description: `_ : Deleted Successfully`,
          content: {},
        },
        404: {
          description: "Assignment not found for id: _",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/MessageResponse" },
            },
          },
        },
      },
    },
  },
};

export const swaggerSpec: OpenAPIV3.Document = {
  openapi: "3.0.0",
  info: { title: "Credential Issuance API", version: "1.0.0" },
  paths,
  components: { schemas },
};
