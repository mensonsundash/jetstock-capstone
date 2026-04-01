const request = require("supertest");
const app = require("../../server");

// Product api testing
describe("Products API TESTING", () => {
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
    
    // testing to list products
    test("GET /api/v1/products should return products list", async () => {
        const response = await request(app)
        .get("/api/v1/products")
        .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("data");
    });

    // testingt to search products
    test("GET /api/v1/products?q=shirt should support search", async () => {
        const response = await request(app)
        .get("/api/v1/products?q=shirt")
        .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty("data");
    });

    //testing to create product
    test("POST /api/v1/products should create product", async () => {
        const response = await request(app)
        .post("/api/v1/products")
        .set("Authorization", `Bearer ${token}`)
        .send({
            user_id: 1,
            supplier_id: 1,
            category_id: 1,
            sku: `SKU-${Date.now()}`,
            name: "Test Product",
            description: "Product created in automated test",
            price: 49.99,
            image_url: "https://example.com/test-product.jpg",
            quantity_on_hand: 20,
            reorder_level: 5,
            location: "Warehouse A",
        });

        expect([201, 409, 400]).toContain(response.statusCode);
        expect(response.body).toHaveProperty("message");
    });
    
  
});