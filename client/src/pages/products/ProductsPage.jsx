import { Alert, Box, Button, IconButton, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useState } from "react";

import Loader from "../../components/common/Loader";
import ProductForm from "../../components/forms/ProductFrom";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../../api/productApi";
import { getAllCategories } from "../../api/categoryApi";
import { getAllSuppliers } from "../../api/supplierApi";

// Products page
// Handles product listing and CRUD actions
const ProductsPage = () => {
  // Product data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dialog state
  const [openForm, setOpenForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Load products + dropdown data
  const fetchProductsPageData = async () => {
    try {
      setLoading(true);
      setError("");

      const [productsResponse, categoriesResponse, suppliersResponse] =
        await Promise.all([
          getAllProducts(),
          getAllCategories(),
          getAllSuppliers(),
        ]);

      setProducts(productsResponse?.data || []);
      setCategories(categoriesResponse?.data || []);
      setSuppliers(suppliersResponse?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Load on mount
  useEffect(() => {
    fetchProductsPageData();
  }, []);

  // Open create form
  const handleOpenCreate = () => {
    setSelectedProduct(null);
    setOpenForm(true);
    setError("");
    setSuccess("");
  };

  // Open edit form
  const handleOpenEdit = (product) => {
    setSelectedProduct(product);
    setOpenForm(true);
    setError("");
    setSuccess("");
  };

  // Close form dialog
  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedProduct(null);
  };

  // Create or update product
  const handleSubmitProduct = async (payload) => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      if (selectedProduct) {
        await updateProduct(selectedProduct.id, payload);
        setSuccess("Product updated successfully");
      } else {
        await createProduct(payload);
        setSuccess("Product created successfully");
      }

      handleCloseForm();
      await fetchProductsPageData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save product");
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteProduct(id);
      setSuccess("Product deleted successfully");
      await fetchProductsPageData();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete product");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Stack spacing={3}>
      {/* Page header */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4">Products</Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Manage product records and starting inventory for JetStock
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Add Product
        </Button>
      </Box>

      {/* Feedback */}
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {/* Products table */}
      <Paper sx={{ p: 2 }}>
        {products.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No products found.
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>SKU</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Supplier</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
                <TableCell><strong>Qty</strong></TableCell>
                <TableCell><strong>Reorder</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category?.name || "-"}</TableCell>
                  <TableCell>{product.supplier?.name || "-"}</TableCell>
                  <TableCell>${product.price}</TableCell>
                  <TableCell>{product.inventory?.quantity_on_hand ?? "-"}</TableCell>
                  <TableCell>{product.inventory?.reorder_level ?? "-"}</TableCell>
                  <TableCell>{product.inventory?.location || "-"}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEdit(product)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Create/Edit dialog */}
      <ProductForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmitProduct}
        initialValues={selectedProduct}
        categories={categories}
        suppliers={suppliers}
        submitting={submitting}
      />
    </Stack>
  );
};

export default ProductsPage;
