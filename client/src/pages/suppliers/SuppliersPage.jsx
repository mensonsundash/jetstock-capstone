import { useEffect, useState } from "react";
import { Alert, Box, Button, IconButton, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Loader from "../../components/common/Loader";
import SupplierForm from "../../components/forms/SupplierForm";
import { getAllSuppliers, createSupplier, updateSupplier, deleteSupplier, } from "../../api/supplierApi";
import { useToast } from "../../hooks/useToast";


// Suppliers page: Show supplier list and handle create, update, delete operations
const SuppliersPage = () => {
  // Supplier data state set from response data from backend
  const [suppliers, setSuppliers] = useState([]);

  // UI states
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Global toast helpers
  const { showSuccess, showError } = useToast();

  // Dialog state
  const [openForm, setOpenForm] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  // Load suppliers from backend
  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllSuppliers(); // fetch data from api req call
      setSuppliers(response?.data || []); //set sate value with response data
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load suppliers");
    } finally {
      setLoading(false);
    }
  };

  // useEffect: Run once on page mounted
  useEffect(() => {
    fetchSuppliers();
  }, []);

  // handling Open create dialog
  const handleOpenCreate = () => {
    setSelectedSupplier(null);
    setOpenForm(true);
    setError("");
    setSuccess("");
  };

  // handling Open edit dialog
  const handleOpenEdit = (supplier) => {
    setSelectedSupplier(supplier);
    setOpenForm(true);
    setError("");
    setSuccess("");
  };

  // Close dialog
  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedSupplier(null);
  };

  // Handle create/ update supplier
  const handleSubmitSupplier = async (payload) => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      // if selectedSupplier has data then its edit mode which updates the data 
      // with payload send to api
      if (selectedSupplier) {
        await updateSupplier(selectedSupplier.id, payload);
        showSuccess("Supplier updated successfully");
      } else {
        await createSupplier(payload);
        showSuccess("Supplier created successfully");
      }

      handleCloseForm();
      await fetchSuppliers();
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to save supplier";
      setError(message);
      showError(message);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  // Delete supplier
  const handleDeleteSupplier = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await deleteSupplier(id);
      showSuccess("Supplier deleted successfully");
      await fetchSuppliers();
    } catch (err) {
      const message = err?.response?.data?.message || "Failed to delete supplier";
      setError(message);
      showError(message);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Stack spacing={3}>
      {/* Page header and action button */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4">Suppliers</Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Manage supplier records for JetStock
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenCreate}
        >
          Add Supplier
        </Button>
      </Box>

      {/* Feedback messages */}
      {error && <Alert severity="error">{error}</Alert>}
      {success && <Alert severity="success">{success}</Alert>}

      {/* Suppliers table */}
      <Paper sx={{ p: 2 }}>
        {suppliers.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No suppliers found.
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Contact Person</strong></TableCell>
                <TableCell><strong>Email</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>Address</strong></TableCell>
                <TableCell align="right"><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.id}</TableCell>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.contact_person}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.address}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenEdit(supplier)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDeleteSupplier(supplier.id)}
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

      {/* Create/Edit supplier dialog */}
      <SupplierForm
        open={openForm}
        onClose={handleCloseForm}
        onSubmit={handleSubmitSupplier}
        initialValues={selectedSupplier}
        submitting={submitting}
      />
    </Stack>
  );
};

export default SuppliersPage;
