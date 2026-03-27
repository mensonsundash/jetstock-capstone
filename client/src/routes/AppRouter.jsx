import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/common/ProtectedRoute';
import AppLayout from '../components/layout/AppLayout';

// importing pages
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import CategoriesPage from "../pages/categories/CategoriesPage";
import SuppliersPage from "../pages/suppliers/SuppliersPage";
import ProductsPage from "../pages/products/ProductsPage";
import InventoryPage from "../pages/inventory/InventoryPage";
import StockInPage from "../pages/stock/StockInPage";
import StockOutPage from "../pages/stock/StockOutPage";
import StockMovementPage from "../pages/stock/StockMovementPage";
import ReportsPage from "../pages/reports/ReportsPage";
import NotFoundPage from "../pages/NotFoundPage";

// Router function for pages routing
const AppRouter = () => {
  return (
    <Routes>
        {/* Public pages */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected route pages */}
        <Route
            path="/"
            element={
            <ProtectedRoute>
                <AppLayout />
            </ProtectedRoute>
            }
        >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="suppliers" element={<SuppliersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="stock-in" element={<StockInPage />} />
            <Route path="stock-out" element={<StockOutPage />} />
            <Route path="stock-movements" element={<StockMovementPage />} />
            <Route path="reports" element={<ReportsPage />} />
        </Route>

        {/* Not found page */}
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRouter;