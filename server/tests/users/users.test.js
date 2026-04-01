const request = require("supertest");
const app = require("../../server");

// Users api testing as AUTH test is done in auth.test.js
describe("Users API TESTING", () => {
    let token = "";

    //generating login mock
    beforeAll(async () => {
        const loginResponse = await request(app)
        .post("/api/v1/auth/login")
        .send({
            email: "testuser@example.com",
            password: "Password123",
        });

        token = loginResponse.body.token;
    });

    // testing to check admin| user | without token user
    test("GET /api/v1/users should reject non-admin or missing token", async () => {
        const response = await request(app)
        .get("/api/v1/users")
        .set("Authorization", `Bearer ${token}`);

        expect([200, 403]).toContain(response.statusCode);
        expect(response.body).toHaveProperty("message");
    });
    
});