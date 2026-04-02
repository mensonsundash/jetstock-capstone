import { render, screen } from "@testing-library/react"; // render React Component and Element in test environment
import { MemoryRouter } from "react-router-dom"; // providing router context
import ProductsPage from "../../../pages/products/ProductsPage"; // testing component
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

//mock custom product api
vi.mock("../../../api/productApi", () => ({
    //get|create|update|delete functions access
    getAllProducts: vi.fn(() =>
        Promise.resolve({
        data: [
            {
            id: 1,
            sku: "SKU-1",
            name: "Test Product",
            price: 10,
            category: { name: "Category A" },
            supplier: { name: "Supplier A" },
            inventory: { quantity_on_hand: 10, reorder_level: 2, location: "A1" },
            },
        ],
        })
    ),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
}));

// mock get all categories api
vi.mock("../../../api/categoryApi", () => ({
  getAllCategories: vi.fn(() => Promise.resolve({ data: [] })),
}));

// mock get all suppliers api
vi.mock("../../../api/supplierApi", () => ({
  getAllSuppliers: vi.fn(() => Promise.resolve({ data: [] })),
}));

// mock custom toast hook
vi.mock("../../../hooks/useToast", () => ({
  useToast: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
  }),
}));


// Product page test suite
describe("ProductsPage", () => {

    //Test Case: check whether product page  UI renders
    test("renders products page heading", async () => {
        // Render areas Under ProtectedRoute component wrapped with MemoryRouer
        render(
        <MemoryRouter>
            <ProductsPage />
        </MemoryRouter>
        );

        // screen.debug();

        //assertions : checking in render DOM for existence
        // expect(screen.getByText(/products/i)).toBeInTheDocument();
        expect(await screen.findByText(/products/i)).toBeInTheDocument();
        
    });
});