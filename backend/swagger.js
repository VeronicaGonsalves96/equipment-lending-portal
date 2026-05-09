const swaggerJSDoc = require("swagger-jsdoc");

const port = process.env.PORT || 4000;
const apiBase =
  process.env.API_BASE_URL || `http://localhost:${port}/api`;

const definition = {
  openapi: "3.0.0",
  info: {
    title: "Equipment Lending Portal API",
    version: "1.0.0",
    description: "API for managing equipment lending requests.",
  },
  servers: [{ url: apiBase }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "Token",
      },
    },
    schemas: {
      User: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string" },
          role: { type: "string" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          token: { type: "string" },
          user: { $ref: "#/components/schemas/User" },
        },
      },
      Equipment: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          category: { type: "string" },
          condition: { type: "string" },
          quantity: { type: "integer" },
          available_quantity: { type: "integer" },
        },
      },
      BorrowRequest: {
        type: "object",
        properties: {
          id: { type: "string" },
          user_id: { type: "string" },
          user_name: { type: "string" },
          equipment_id: { type: "string" },
          equipment_name: { type: "string" },
          start_date: { type: "string", format: "date" },
          end_date: { type: "string", format: "date" },
          status: { type: "string" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
      },
    },
  },
  paths: {
    "/auth/signup": {
      post: {
        tags: ["Auth"],
        summary: "Create a user",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string" },
                  email: { type: "string" },
                  password: { type: "string" },
                  role: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: "User created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" },
              },
            },
          },
          400: { description: "Missing required fields" },
          409: { description: "Email already registered" },
        },
      },
    },
    "/auth/login": {
      post: {
        tags: ["Auth"],
        summary: "Login and receive token",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string" },
                  password: { type: "string" },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: "Logged in",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" },
              },
            },
          },
          401: { description: "Invalid credentials" },
        },
      },
    },
    "/auth/logout": {
      post: {
        tags: ["Auth"],
        summary: "Logout",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Logged out" },
          401: { description: "Missing/invalid token" },
        },
      },
    },
    "/auth/me": {
      get: {
        tags: ["Auth"],
        summary: "Get current user",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "User profile",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    user: { $ref: "#/components/schemas/User" },
                  },
                },
              },
            },
          },
          401: { description: "Missing/invalid token" },
        },
      },
    },
    "/equipment": {
      get: {
        tags: ["Equipment"],
        summary: "List equipment",
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: "Equipment list",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    items: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Equipment" },
                    },
                  },
                },
              },
            },
          },
          401: { description: "Missing/invalid token" },
        },
      },
      post: {
        tags: ["Equipment"],
        summary: "Create equipment (admin)",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "category", "condition", "quantity"],
                properties: {
                  name: { type: "string" },
                  category: { type: "string" },
                  condition: { type: "string" },
                  quantity: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Created" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/equipment/{id}": {
      get: {
        tags: ["Equipment"],
        summary: "Get equipment details",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Equipment" },
          404: { description: "Not found" },
        },
      },
      put: {
        tags: ["Equipment"],
        summary: "Update equipment (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "category", "condition", "quantity"],
                properties: {
                  name: { type: "string" },
                  category: { type: "string" },
                  condition: { type: "string" },
                  quantity: { type: "integer" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Updated" },
          403: { description: "Forbidden" },
        },
      },
      delete: {
        tags: ["Equipment"],
        summary: "Delete equipment (admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          200: { description: "Deleted" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/borrow": {
      post: {
        tags: ["Borrow"],
        summary: "Create borrow request",
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["equipmentId", "startDate", "endDate"],
                properties: {
                  equipmentId: { type: "string" },
                  startDate: { type: "string", format: "date" },
                  endDate: { type: "string", format: "date" },
                },
              },
            },
          },
        },
        responses: {
          201: { description: "Created" },
          409: { description: "Not available" },
        },
      },
      get: {
        tags: ["Borrow"],
        summary: "List all requests (staff/admin)",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Requests" },
          403: { description: "Forbidden" },
        },
      },
    },
    "/borrow/mine": {
      get: {
        tags: ["Borrow"],
        summary: "List my requests",
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: "Requests" },
          401: { description: "Missing/invalid token" },
        },
      },
    },
    "/borrow/{id}/approve": {
      post: {
        tags: ["Borrow"],
        summary: "Approve request (staff/admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Approved" },
          400: { description: "Invalid status" },
        },
      },
    },
    "/borrow/{id}/reject": {
      post: {
        tags: ["Borrow"],
        summary: "Reject request (staff/admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Rejected" },
          400: { description: "Invalid status" },
        },
      },
    },
    "/borrow/{id}/return": {
      post: {
        tags: ["Borrow"],
        summary: "Mark returned (staff/admin)",
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Returned" },
          400: { description: "Invalid status" },
        },
      },
    },
  },
};

const swaggerSpec = swaggerJSDoc({ definition, apis: [] });

module.exports = swaggerSpec;