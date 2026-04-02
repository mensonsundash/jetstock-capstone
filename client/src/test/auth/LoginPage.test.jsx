import { render, screen } from "@testing-library/react"; // render React Component and Element in test environment
import { MemoryRouter } from "react-router-dom"; // providing router context
import LoginPage from "../../pages/auth/LoginPage"; // testing component
import { describe, expect, test, vi } from "vitest"; //using vite test methods

//mock custom auth hooks
vi.mock("../../hooks/useAuth", () =>({
    // mock functions using vitest
    useAuth: () => ({
        login: vi.fn(),
    })
}));

// mock custom toast hook
vi.mock("../../hooks/useToast", () => ({
  useToast: () => ({
    showError: vi.fn(),
  }),
}));

// Login page test suite
describe("LoginPage", () => {

    //Test Case: check whether login form UI renders
    test("renders login form", () => {
        // Render the LoginPage component wrapped with MemoryRouer
        render(
        <MemoryRouter>
            <LoginPage />
        </MemoryRouter>
        );

        //assertions : checking in render DOM for existence
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    });
});