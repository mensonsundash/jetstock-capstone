import { render, screen } from "@testing-library/react"; // render React Component and Element in test environment
import { MemoryRouter } from "react-router-dom"; // providing router context
import ProtectedRoute from "../../components/common/ProtectedRoute"; // testing component
import { describe, expect, test, vi } from "vitest"; //using vite test methods

//mock custom auth hooks
vi.mock("../../hooks/useAuth", () =>({
    // mock functions using vitest
    useAuth: () => ({
        isAuthenticated: true,
        loading: false,
    })
}));

// Protected Route test suite
describe("ProtectedRoute", () => {

    //Test Case: check whether register form UI renders
    test("renders children when authenticated", () => {
        // Render areas Under ProtectedRoute component wrapped with MemoryRouer
        render(
        <MemoryRouter>
            <ProtectedRoute>
                <div>Protected Area</div>
            </ProtectedRoute>
        </MemoryRouter>
        );

        //assertions : checking in render DOM for existence
        expect(screen.getByText("Protected Area")).toBeInTheDocument();
        
    });
});