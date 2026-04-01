const request = require("supertest");
const app = require("../../server");

// Category api testing
describe("Categories API TESTING", () => {
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
    
    // testing to get categories without authorization
    test("GET /api/v1/categories should require authentication", async () => {
        const response = await request(app).get("/api/v1/categories");

        expect(response.statusCode).toBe(401);
    });

    // testing to get categories after authorization
    test("GET /api/v1/categories should return category list when authenticated", async () => {
        const response = await request(app)
        .get("/api/v1/categories")
        .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("data");
    });

    // testing to create category
    test("POST /api/v1/categories should create category", async () => {
        const response = await request(app)
        .post("/api/v1/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({
            user_id: 1,
            name: "Testing Category",
            description: "Created in automated test",
        });

        expect([201, 409]).toContain(response.statusCode);
        expect(response.body).toHaveProperty("message");
    });
  
});