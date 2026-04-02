import { render, screen } from "@testing-library/react"; // render React Component and Element in test environment
import { MemoryRouter } from "react-router-dom"; // providing router context
import RegisterPage from "../../pages/auth/RegisterPage"; // testing component
import { describe, expect, test, vi } from "vitest"; //using vite test methods

//mock custom auth hooks
vi.mock("../../hooks/useAuth", () =>({
    // mock functions using vitest
    useAuth: () => ({
        register: vi.fn(),
    })
}));

// mock custom toast hook
vi.mock("../../hooks/useToast", () => ({
  useToast: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
  }),
}));

// Register page test suite
describe("RegisterPage", () => {

    //Test Case: check whether register form UI renders
    test("renders register form", () => {
        // Render the RegisterPage component wrapped with MemoryRouer
        render(
        <MemoryRouter>
            <RegisterPage />
        </MemoryRouter>
        );

        //assertions : checking in render DOM for existence
        expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
    });
});