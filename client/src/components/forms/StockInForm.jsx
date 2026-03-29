import { useEffect, useState } from "react";
import { Alert, Button, MenuItem, Paper, Stack, TextField, Typography } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

// Stock In form
// Lets user add stock quantity to an existing product
const StockInForm = ({ products = [], onSubmit, submitting = false }) => {
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = useState({
    product_id: "",
    quantity: "",
    source_type: "MANUAL",
    note: "",
    movement_date: "",
  });

  // Local error message
  const [error, setError] = useState("");

  // Set default movement date when component loads
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);

    setFormData((prev) => ({
      ...prev,
      movement_date: today,
    }));
  }, []);

  // Update field values
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit stock-in request
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.product_id || !formData.quantity) {
      setError("Product and quantity are required");
      return;
    }

    try {
      await onSubmit({
        product_id: Number(formData.product_id),
        user_id: user?.id,
        quantity: Number(formData.quantity),
        source_type: formData.source_type,
        note: formData.note.trim(),
        movement_date: formData.movement_date,
      });

      // Reset form after success
      setFormData((prev) => ({
        ...prev,
        product_id: "",
        quantity: "",
        source_type: "MANUAL",
        note: "",
      }));
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to stock in product");
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={2}>
        Stock In
      </Typography>

      <Stack component="form" spacing={2} onSubmit={handleSubmit}>
        {error && <Alert severity="error">{error}</Alert>}

        <TextField select label="Product" name="product_id" value={formData.product_id} onChange={handleChange} fullWidth required >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name} ({product.sku})
            </MenuItem>
          ))}
        </TextField>

        <TextField label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} fullWidth required />

        <TextField select label="Source Type" name="source_type" value={formData.source_type} onChange={handleChange} fullWidth >
          <MenuItem value="MANUAL">Manual</MenuItem>
          <MenuItem value="RETURN">Return</MenuItem>
          <MenuItem value="DAMAGE">Damage Recovery</MenuItem>
        </TextField>

        <TextField label="Movement Date" name="movement_date" type="date" value={formData.movement_date} onChange={handleChange} fullWidth />

        <TextField label="Note" name="note" value={formData.note} onChange={handleChange} fullWidth multiline minRows={3} />

        <Button type="submit" variant="contained" disabled={submitting}>
          {submitting ? "Saving..." : "Save Stock In"}
        </Button>
      </Stack>
    </Paper>
  );
};

export default StockInForm;