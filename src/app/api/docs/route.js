const resources = [
  "admins",
  "courses",
  "teachers",
  "subjects",
  "campaigns",
  "questions",
  "feedback",
];
const paths = Object.fromEntries(
  resources.flatMap((resource) => [
    [
      `/api/${resource}`,
      {
        get: {
          summary: `List ${resource}`,
          responses: { 200: { description: "Success" } },
        },
      },
    ],
    [
      `/api/${resource}/{id}`,
      {
        get: {
          summary: `Get ${resource} by id`,
          responses: { 200: { description: "Success" } },
        },
      },
    ],
  ]),
);
for (const resource of resources.filter((item) => item !== "feedback")) {
  paths[`/api/${resource}`].post = {
    summary: `Create ${resource}`,
    security: [{ session: [] }],
    responses: { 201: { description: "Created" } },
  };
  paths[`/api/${resource}/{id}`].patch = {
    summary: `Update ${resource}`,
    security: [{ session: [] }],
    responses: { 200: { description: "Updated" } },
  };
  paths[`/api/${resource}/{id}`].delete = {
    summary: `Delete ${resource}`,
    security: [{ session: [] }],
    responses: { 200: { description: "Deleted" } },
  };
}
paths["/api/feedback"].post = {
  summary: "Submit anonymous feedback",
  responses: {
    201: { description: "Submitted" },
    409: { description: "Duplicate device submission" },
  },
};
for (const name of ["dashboard", "teachers", "courses", "campaigns"])
  paths[`/api/analytics/${name}`] = {
    get: {
      summary: `${name} analytics`,
      security: [{ session: [] }],
      responses: { 200: { description: "Success" } },
    },
  };
export function GET(request) {
  return Response.json({
    openapi: "3.1.0",
    info: { title: "CampusVoice API", version: "1.0.0" },
    servers: [{ url: new URL(request.url).origin }],
    paths,
    components: {
      securitySchemes: {
        session: { type: "apiKey", in: "cookie", name: "authjs.session-token" },
      },
    },
  });
}
