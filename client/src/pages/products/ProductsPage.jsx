import { Alert, Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, TextField, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useMemo, useState } from "react";

import Loader from "../../components/common/Loader";
import ProductForm from "../../components/forms/ProductForm";
import { getAllProducts, createProduct, updateProduct, deleteProduct } from "../../api/productApi";
import { getAllCategories } from "../../api/categoryApi";
import { getAllSuppliers } from "../../api/supplierApi";
import useDebounce from "../../hooks/useDebounce";
import { useToast } from "../../hooks/useToast";

// Products page
// Handles: - product listing, create / update / delete, server-side: search, category/supplier filter, client-side: sorting
const ProductsPage = () => {
  // Main product data
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

  // Global toast helpers
  const { showSuccess, showError } = useToast();

  // Search / filter / sort state
  const [searchText, setSearchText] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState("");
  const [sortBy, setSortBy] = useState("");

  // pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // debounced search text : this value only changes after the user stops typing
  const debouncedSearchText = useDebounce(searchText.trim(), 500);

  // Load categories and suppliers for dropdowns
  const fetchReferenceData = async () => {
    const [categoriesResponse, suppliersResponse] = await Promise.all([
      getAllCategories(),
      getAllSuppliers(),
    ]);

    setCategories(categoriesResponse?.data || []);
    setSuppliers(suppliersResponse?.data || []);
  };

  // Load all products initially
  const fetchAllProductsData = async ({
    q ="",
    categoryId ="",
    supplierId = ""
  } = {}) => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllProducts({
        q,
        categoryId,
        supplierId
      });
      setProducts(response.data || []);
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Initial page load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError("");
        await fetchReferenceData();
        await fetchAllProductsData({
                q: debouncedSearchText,
                categoryId: selectedCategoryId,
                supplierId: selectedSupplierId
              });
      } catch (error) {
        setError(error?.response?.data?.message || "Failed to load products page");
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // SEARCH/FILTER: Search/filter effect runs everytime event changes
  useEffect(() => {
    fetchAllProductsData({
      q: debouncedSearchText,
      categoryId: selectedCategoryId,
      supplierId: selectedSupplierId
    });

    //reset current page when search filter values changes
    setPage(0);
  }, [debouncedSearchText, selectedCategoryId, selectedSupplierId, sortBy]);

  // SORT: Apply client-side sort to the currently loaded product list
  const sortedProducts = useMemo(() => {
    const clonedProducts = [...products];

    switch (sortBy) {
      case "name-asc":
        return clonedProducts.sort((a, b) => a.name.localeCompare(b.name));

      case "name-desc":
        return clonedProducts.sort((a, b) => b.name.localeCompare(a.name));

      case "price-asc":
        return clonedProducts.sort((a, b) => Number(a.price) - Number(b.price));

      case "price-desc":
        return clonedProducts.sort((a, b) => Number(b.price) - Number(a.price));

      default:
        return clonedProducts;
    }
  }, [products, sortBy]);

  // slice sorted products for the current page
  const paginatedProducts = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    return sortedProducts.slice(startIndex, endIndex);
  }, [sortedProducts, page, rowsPerPage]);

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

  // Close dialog
  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedProduct(null);
  };

  // Handle page change
  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  // Handle rows-per-page change
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(0);
  }

  // Create or update product
  const handleSubmitProduct = async (payload) => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      if (selectedProduct) {
        await updateProduct(selectedProduct.id, payload);
        showSuccess("Product updated successfully");
      } else {
        await createProduct(payload);
        showSuccess("Product created successfully");
      }

      handleCloseForm();
      await fetchAllProductsData({
              q: debouncedSearchText,
              categoryId: selectedCategoryId,
              supplierId: selectedSupplierId
            });
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to save product";
      setError(message);
      showError(message);
      throw error;
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
      showSuccess("Product deleted successfully");
      await fetchAllProductsData({
              q: debouncedSearchText,
              categoryId: selectedCategoryId,
              supplierId: selectedSupplierId
            });
    } catch (error) {
      const message = error?.response?.data?.message || "Failed to delete product";
      setError(message);
      showError(message);
    }
  };

  // Reset all search / filter / sort values
  const handleResetFilters = async () => {
    setSearchText("");
    setSelectedCategoryId("");
    setSelectedSupplierId("");
    setSortBy("");
    setPage(0);
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

      {/* Feedback messages */}
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {/* Search / filter / sort controls */}
      <Paper sx={{ p: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          flexDirection={{ xs: "column", md: "row" }}
          gap={2}
        >
          {/* Left side controls */}
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            gap={2}
            flexWrap="wrap"
            flex={1}
          >
            <TextField
              label="Search by Name or SKU"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ minWidth: 230, flex: 1 }}
            />

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="category-filter-label">Filter by Category</InputLabel>
              <Select
                labelId="category-filter-label"
                value={selectedCategoryId}
                label="Filter by Category"
                onChange={(e) => setSelectedCategoryId(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="supplier-filter-label">Filter by Supplier</InputLabel>
              <Select
                labelId="supplier-filter-label"
                value={selectedSupplierId}
                label="Filter by Supplier"
                onChange={(e) => setSelectedSupplierId(e.target.value)}
              >
                <MenuItem value="">All Suppliers</MenuItem>
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="sort-label">Sort</InputLabel>
              <Select
                labelId="sort-label"
                value={sortBy}
                label="Sort"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="">Default</MenuItem>
                <MenuItem value="name-asc">Name A-Z</MenuItem>
                <MenuItem value="name-desc">Name Z-A</MenuItem>
                <MenuItem value="price-asc">Price Low-High</MenuItem>
                <MenuItem value="price-desc">Price High-Low</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Right side reset button */}
          <Box
            display="flex"
            justifyContent={{ xs: "stretch", md: "flex-end" }}
            alignItems="center"
          >
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              sx={{ minWidth: 120, height: 56 }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Products table */}
      <Paper sx={{ p: 2 }}>
        {sortedProducts.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No products found.
          </Typography>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Image</strong></TableCell>
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
                {paginatedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>
                      {product.image_url ? (
                        <Box component="img" src={product.image_url} alt={product.name} 
                        sx={{ width:50, height:50, objectFit: "cover", borderRadius:1, border: "1px solid #ddd" }} 
                          onError={(e) => {e.currentTarget.style.display = "none"; }} /> 
                      ): ("-")}
                    </TableCell>
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
              {/* Pagination controls */}
            <TablePagination component="div" 
              count={sortedProducts.length} 
              page={page} 
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[1,5,10,25]}
            />
          </>
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
