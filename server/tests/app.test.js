const request = require("supertest");
const app = require("../server");

// Basic app smoke test
describe("App Health", () => {
  test("GET / should return backend running message", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "JetStock backend is running");
  });
});