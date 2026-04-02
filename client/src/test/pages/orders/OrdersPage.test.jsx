import { render, screen } from "@testing-library/react"; // render React Component and Element in test environment
import { MemoryRouter } from "react-router-dom"; // providing router context
import OrdersPage from "../../../pages/orders/OrdersPage"; // testing component
import { describe, expect, test, vi } from "vitest"; //using vite test methods


// mock authentication
vi.mock("../../../hooks/useAuth", () => ({
  useAuth: () => ({
    user: {
      id: 1,
      first_name: "Menson",
      role: "admin",
    },
    isAuthenticated: true,
  }),
}));

//mock custom order api
vi.mock("../../../api/orderApi", () => ({
  getAllOrders: vi.fn(() =>
    Promise.resolve({
      data: [
        {
          id: 101,
          order_date: "2026-04-02",
          status: "pending",
          total_amount: 100,
          customer: {
            full_name: "John Customer",
            email: "john@example.com",
            phone: "0400111222",
          },
          items: [
            {
              id: 1,
              quantity: 2,
              unit_price: 50,
              sub_total: 100,
              product: {
                name: "Test Product",
                sku: "SKU-TEST",
                user: {
                  first_name: "Owner",
                  last_name: "One",
                  business_name: "Jet Business",
                },
              },
            },
          ],
        },
      ],
    })
  ),
}));

// mock custom toast hook
vi.mock("../../../hooks/useToast", () => ({
  useToast: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
  }),
}));


// ORrders page test suite
describe("OrdersPage", () => {

    //Test Case: check whether product page  UI renders
    test("renders customers order and its product items detail", async () => {
        // Render areas Under ProtectedRoute component wrapped with MemoryRouer
        render(
        <MemoryRouter>
            <OrdersPage />
        </MemoryRouter>
        );

        //assertions : checking in render DOM for existence
        expect(await screen.findByText(/john customer/i)).toBeInTheDocument();
        expect(await screen.findByText(/test product/i)).toBeInTheDocument();
        
    });
});