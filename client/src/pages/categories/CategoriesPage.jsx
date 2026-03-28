import { Alert, Box, Button, IconButton, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useState } from "react";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../../api/categoryApi";
import Loader from "../../components/common/Loader";
import CategoryForm from "../../components/forms/CategoryForm";

// categories page : Show cateogry list and handle create, update, delete operations
const CategoriesPage = () => {
   // Categories state set from response data from backend
  const [categories, setCategories] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dialog state
  const [openForm, setOpenForm] = useState(false); // control dialog form is visible or not
  const [selectedCategory, setSelectedCategory] = useState(null);// selectedCategory if edit mode then its has data if not then null for add mode

  // Load categories on page mount
  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      // fetch data from api req call
      const response = await getAllCategories();

      //setting data state with response value 
      setCategories(response.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  };
  
  // useEffect: Run once when categories page mounted
  useEffect(() => {
    fetchCategories();
  }, []);

  // handling Open form for create mode
  const handleOpenCreate = () => {
    setSelectedCategory(null); // not data then add mode
    setOpenForm(true); // form dialog control close or open
    setError("");
    setSuccess("");
  };

  // Open form for edit mode
  const handleOpenEdit = (category) => {
    setSelectedCategory(category);
    setOpenForm(true);
    setError("");
    setSuccess("");
  };

  // Close form dialog
  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedCategory(null);
  };

  // Handle create/update submit from form
  const handleSubmitCategory = async (payload) => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      // if selectedCategory has data then its edit mode which updates the data 
      // with payload send to api
      if (selectedCategory) {
        await updateCategory(selectedCategory.id, payload);
        setSuccess("Category updated successfully");
      } else {
        await createCategory(payload);
        setSuccess("Category created successfully");
      }

      handleCloseForm();
      await fetchCategories();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save category");
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // Delete category
  const handleDeleteCategory = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteCategory(id);
      setSuccess("Category deleted successfully");
      await fetchCategories();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to delete category");
    }
  };

  //page loader UI 
  if (loading) {
    return <Loader />;
  }

  return (
    <Stack spacing={3}>
      {/* Page heading and add button */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4">Categories</Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Manage product categories for JetStock
          </Typography>
        </Box>

        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate} >
          Add Category
        </Button>
      </Box>

      {/* Feedback messages */}
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {/* Categories table */}
      <Paper sx={{ p: 2 }}>
        {categories.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No categories found.
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.description || "-"}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEdit(category)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDeleteCategory(category.id)}
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
      <CategoryForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmitCategory}
        initialValues={selectedCategory}
        submitting={submitting}
      />
    </Stack>
  );
};

export default CategoriesPage;
