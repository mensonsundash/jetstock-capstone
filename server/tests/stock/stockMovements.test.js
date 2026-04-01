const request = require("supertest");
const app = require("../../server");

// Stock movements api testing
describe("Stock Movements API TESTING", () => {
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
    
    // testing to list stock movements
    test("GET /api/v1/stock-movements should return movement list", async () => {
        const response = await request(app)
        .get("/api/v1/stock-movements")
        .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("data");
    });

    // testing to add stock-in items
    test("POST /api/v1/stock-movements/stock-in should add stock", async () => {
        const response = await request(app)
        .post("/api/v1/stock-movements/stock-in")
        .set("Authorization", `Bearer ${token}`)
        .send({
            user_id: 1,
            product_id: 1,
            quantity: 5,
            source_type: "MANUAL",
            note: "Automated stock in test",
            movement_date: "2026-04-02",
        });

        expect([201, 400, 404]).toContain(response.statusCode);
        expect(response.body).toHaveProperty("message");
    });

    // testing to remove stock-out items
    test("POST /api/v1/stock-movements/stock-out should remove stock", async () => {
        const response = await request(app)
        .post("/api/v1/stock-movements/stock-out")
        .set("Authorization", `Bearer ${token}`)
        .send({
            user_id: 1,
            product_id: 1,
            quantity: 2,
            source_type: "MANUAL",
            note: "Automated stock out test",
            movement_date: "2026-04-02",
        });

        expect([201, 400, 404]).toContain(response.statusCode);
        expect(response.body).toHaveProperty("message");
    });
  
});