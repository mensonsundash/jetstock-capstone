import { useEffect, useState } from "react";
import { Alert, Stack, Typography } from "@mui/material";

import Loader from "../../components/common/Loader";
import StockOutForm from "../../components/forms/StockOutForm";
import { getAllProducts } from "../../api/productApi";
import { stockOutProduct } from "../../api/stockMovementApi";
import { useToast } from "../../hooks/useToast";

// Stock Out page
// Loads products and allows stock quantity decrease
const StockOutPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Global toast helpers
  const { showSuccess, showError } = useToast();

  // Load products for dropdown
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllProducts();
      setProducts(response?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Initial page load for once
  useEffect(() => {
    fetchProducts();
  }, []);

  // Submit stock-out form
  const handleSubmit = async (payload) => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await stockOutProduct(payload);
      showSuccess("Stock out recorded successfully");
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to save stock out";
      setError(message);
      showError(message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  //loading UI
  if (loading) {
    return <Loader />;
  }

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Stock Out</Typography>
        <Typography variant="body1" color="text.secondary" mt={1}>
          Remove stock from an existing product
        </Typography>
      </div>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <StockOutForm
        products={products}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </Stack>
  );
};

export default StockOutPage;