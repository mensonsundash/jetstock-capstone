const request = require("supertest");
const app = require("../../server");

// Supplier api testing
describe("Suppliers API TESTING", () => {
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

    // Now start main only testing
    // testing to get list of suppliers
    test("GET /api/v1/suppliers should return suppliers list", async () => {
        const response = await request(app)
        .get("/api/v1/suppliers")
        .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("data");
    });

    // testing to create suupliers
    test("POST /api/v1/suppliers should create supplier", async () => {
        const response = await request(app)
        .post("/api/v1/suppliers")
        .set("Authorization", `Bearer ${token}`)
        .send({
            user_id: 1,
            name: "Test Supplier",
            email: "supplier-test@example.com",
            contact_person: "Supplier Contact",
            phone: "0411111111",
            address: "Sydney NSW",
        });

        expect([201, 409]).toContain(response.statusCode);
        expect(response.body).toHaveProperty("message");
    });
    
  
});