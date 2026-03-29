import { Alert, Box, Button, IconButton, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { useEffect, useState } from "react";
import { createCategory, deleteCategory, getAllCategories, updateCategory } from "../../api/categoryApi";
import Loader from "../../components/common/Loader";
import CategoryForm from "../../components/forms/CategoryForm";
import { useToast } from "../../hooks/useToast";
import ConfirmDialog from "../../components/common/ConfirmDialog";

// categories page : Show cateogry list and handle create, update, delete operations
const CategoriesPage = () => {
   // Categories state set from response data from backend
  const [categories, setCategories] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Global toast helpers
  const { showSuccess, showError } = useToast();

  // Dialog state
  const [openForm, setOpenForm] = useState(false); // control dialog form is visible or not
  const [selectedCategory, setSelectedCategory] = useState(null);// selectedCategory if edit mode then its has data if not then null for add mode

  // Confirm dialog state for delete action
  const [openConfirm, setOpenConfirm] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

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
        showSuccess("Category updated successfully");
      } else {
        await createCategory(payload);
        showSuccess("Category created successfully");
      }

      handleCloseForm();
      await fetchCategories();
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to save category";
      setError(message);
      showError(message)
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // Open confirm dialog before delete
  const handleOpenDeleteConfirm = (category) => {
    setCategoryToDelete(category);
    setOpenConfirm(true);
  };

  // Close confirm dialog
  const handleCloseDeleteConfirm = () => {
    setCategoryToDelete(null);
    setOpenConfirm(false);
  };

  // Delete confirm category
  const handleConfirmDeleteCategory = async () => {
    if(!categoryToDelete) return;

    try {
      setError("");
      setSuccess("");

      await deleteCategory(categoryToDelete.id);
      showSuccess("Category deleted successfully");
      await fetchCategories();
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to delete category";
      setError(message);
      showError(message);
    } finally{
      handleCloseDeleteConfirm();
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
                      onClick={() => handleOpenDeleteConfirm(category)}
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

      {/* Confirm Dialog */}
            <ConfirmDialog
              open={openConfirm}
              title="Delete Category"
              message={`Are you sure you want to delete "${categoryToDelete?.name || "this category"}"?`}
              onClose={handleCloseDeleteConfirm}
              onConfirm={handleConfirmDeleteCategory}
              confirmText="Delete"
            />
    </Stack>
  );
};

export default CategoriesPage;
