const request = require("supertest");
const app = require("../../server");

// Inventory api testing
describe("Inventory API TESTING", () => {
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
    
    // testing to list inventories
    test("GET /api/v1/inventory should return inventory list", async () => {
        const response = await request(app)
        .get("/api/v1/inventory")
        .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("data");
    });

    // testing to get inventory summary
    test("GET /api/v1/inventory/summary should return summary", async () => {
        const response = await request(app)
        .get("/api/v1/inventory/summary")
        .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("data");
    });

    //testing to get low stock items
    test("GET /api/v1/inventory/low-stock should return low stock items", async () => {
        const response = await request(app)
        .get("/api/v1/inventory/low-stock")
        .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("data");
    });

    //testing to get out of stock items
    test("GET /api/v1/inventory/out-of-stock should return out of stock items", async () => {
        const response = await request(app)
        .get("/api/v1/inventory/out-of-stock")
        .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("data");
    });
  
});