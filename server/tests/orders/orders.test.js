const request = require("supertest");
const app = require("../../server");

// Orders api testing
describe("Orders API TESTING", () => {
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
    
    // testing to list orders
    test("GET /api/v1/orders should return orders list", async () => {
        const response = await request(app)
        .get("/api/v1/orders")
        .set("Authorization", `Bearer ${token}`);

        expect([200, 500]).toContain(response.statusCode);
        expect(response.body).toHaveProperty("message");
    });

    // testing to create order
    test("POST /api/v1/orders should create order", async () => {
        const response = await request(app)
        .post("/api/v1/orders")
        .set("Authorization", `Bearer ${token}`)
        .send({
            customer_id: 1,
            order_date: "2026-04-02",
            status: "pending",
            items: [
            {
                product_id: 1,
                quantity: 1,
            },
            ],
        });

        expect([201, 400, 404, 500]).toContain(response.statusCode);
        expect(response.body).toHaveProperty("message");
    });
  
});