import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Stack, MenuItem, Paper, Typography, Box } from "@mui/material";

/**
 * Reusable product form dialog: Used for both create and edit actions
 * open: controls dialog is visible or not
 * onClose: function to close the dialog
 * onSubmit: submit form data
 * initialValues: if null then empty form for add New data / or if has data then used for preload edit
 * submitting: controls loading state of submit button
 */
const ProductForm = ({
  open,
  onClose,
  onSubmit,
  initialValues = null,
  categories = [],
  suppliers = [],
  submitting = false,
}) => {
    // getting user state from auth Context
    const { user } = useAuth();

    // Local form state
    const [formData, setFormData] = useState({
        user_id: "",
        supplier_id: "",
        category_id: "",
        sku: "",
        name: "",
        description: "",
        price: "",
        image_url: "",
        quantity_on_hand: "",
        reorder_level: "",
        location: "",
    });

    // Local validation / request error
    const [error, setError] = useState("");

    // Populate form for edit mode, reset for create mode
    useEffect(() => {
        if (initialValues) {
        setFormData({
            supplier_id: initialValues.supplier_id || "",
            category_id: initialValues.category_id || "",
            sku: initialValues.sku || "",
            name: initialValues.name || "",
            description: initialValues.description || "",
            price: initialValues.price || "",
            image_url: initialValues.image_url || "",
            // Inventory values usually come from included inventory relation
            quantity_on_hand: initialValues.inventory?.quantity_on_hand ?? "",
            reorder_level: initialValues.inventory?.reorder_level ?? "",
            location: initialValues.inventory?.location || "",
        });
        } else {
        setFormData({
            supplier_id: "",
            category_id: "",
            sku: "",
            name: "",
            description: "",
            price: "",
            image_url: "",
            quantity_on_hand: "",
            reorder_level: "",
            location: "",
        });
        }

    setError("");
  }, [initialValues, open]);

  // Handle all field changes
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit to parent page
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !formData.supplier_id ||
      !formData.category_id ||
      !formData.sku.trim() ||
      !formData.name.trim() ||
      !formData.price
    ) {
      setError(
        "supplier, category, sku, name, and price are required"
      );
      return;
    }

    try {
      await onSubmit({
        user_id: user?.id,
        supplier_id: Number(formData.supplier_id),
        category_id: Number(formData.category_id),
        sku: formData.sku.trim(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        image_url: formData.image_url.trim(),
        quantity_on_hand: formData.quantity_on_hand === "" ? 0 : Number(formData.quantity_on_hand),
        reorder_level: formData.reorder_level === "" ? 5 : Number(formData.reorder_level),
        location: formData.location.trim(),
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save product");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        {initialValues ? "Edit Product" : "Add Product"}
      </DialogTitle>

      <DialogContent>
        <Stack component="form" spacing={2} sx={{ mt: 1 }} onSubmit={handleSubmit}>
          {error && <Alert severity="error">{error}</Alert>}

            <TextField select label="Category" name="category_id" value={formData.category_id} onChange={handleChange} fullWidth required >
                {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>
                        {category.name}
                    </MenuItem>
                ))}
            </TextField>

            <TextField select label="Supplier" name="supplier_id" value={formData.supplier_id} onChange={handleChange} fullWidth required >
          
                {suppliers.map((supplier) => (
                <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                </MenuItem>
                ))}
            </TextField>
            <TextField label="SKU" name="sku" value={formData.sku} onChange={handleChange} fullWidth required />
            <TextField label="Product Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
            <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth multiline minRows={3} />
            <TextField label="Price" name="price" type="number" value={formData.price} onChange={handleChange} fullWidth required />
                
            <TextField label="Image URL" name="image_url" value={formData.image_url} onChange={handleChange} fullWidth placeholder="https://example.com/product-image.jpg" required />

              {/* Live preview of image URL */}
              {formData.image_url && (
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="body" color="text.secondary" mb={1}>Image Preview</Typography>
                  <Box component="img" src={formData.image_url} alt="Product Preview" 
                  sx={{ width:140, height:140, objectFit: "cover", borderRadius:1, border: "1px solid #ddd" }} 
                  onError={(e) => {e.currentTarget.style.display = "none"; }} /> 
                </Paper>
              )}

            <TextField label="Quantity on Hand" name="quantity_on_hand" type="number" value={formData.quantity_on_hand} onChange={handleChange} fullWidth />
            <TextField label="Reorder Level" name="reorder_level" type="number" value={formData.reorder_level} onChange={handleChange} fullWidth />
            <TextField label="Location" name="location" value={formData.location} onChange={handleChange} fullWidth />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
          {submitting
            ? initialValues
              ? "Updating..."
              : "Creating..."
            : initialValues
            ? "Update"
            : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;