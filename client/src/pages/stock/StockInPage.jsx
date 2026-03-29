import { useEffect, useState } from "react";
import { Alert, Stack, Typography } from "@mui/material";

import Loader from "../../components/common/Loader";
import StockInForm from "../../components/forms/StockInForm";
import { getAllProducts } from "../../api/productApi";
import { stockInProduct } from "../../api/stockMovementApi";

// Stock In page
// Loads products and allows stock quantity increase
const StockInPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Load products for product dropdown
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

  // Submit stock-in form
  const handleSubmit = async (payload) => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      await stockInProduct(payload);
      setSuccess("Stock in recorded successfully");
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save stock in");
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // loader UI
  if (loading) {
    return <Loader />;
  }

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Stock In</Typography>
        <Typography variant="body1" color="text.secondary" mt={1}>
          Add incoming stock for an existing product
        </Typography>
      </div>

      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      <StockInForm
        products={products}
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </Stack>
  );
};

export default StockInPage;