const request = require("supertest");
const app = require("../../server");

// Auth api testing
describe("Auth API TESTING", () => {
    //testing sample user
    const testUser = {
        first_name: "Test",
        last_name: "User",
        email: "testuser@example.com",
        password: "Password123",
        business_name: "JetStock Test Business",
        phone: "0123456789",
        address: "Sydney",
    };

  // testing for registration
  test("POST /api/v1/auth/register should create user", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send(testUser);

    // Allow 201 if new user, 409 if already exists
    expect([201, 409]).toContain(response.statusCode);
    expect(response.body).toHaveProperty("message");
  });

  // testing for login with valid credentials
  test("POST /api/v1/auth/login should login with valid credentials", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("token");
    expect(response.body).toHaveProperty("message");
  });

  // testing for login without valid credentials
  test("POST /api/v1/auth/login should fail with wrong password", async () => {
    const response = await request(app)
      .post("/api/v1/auth/login")
      .send({
        email: testUser.email,
        password: "WrongPassword123",
      });

    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty("message");
  });
  
});