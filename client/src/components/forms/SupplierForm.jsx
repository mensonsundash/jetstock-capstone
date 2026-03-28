import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Stack } from "@mui/material";

/**
 * Reusable supplier form dialog: Used for both create and edit actions
 * open: controls dialog is visible or not
 * onClose: function to close the dialog
 * onSubmit: submit form data
 * initialValues: if null then empty form for add New data / or if has data then used for preload edit
 * submitting: controls loading state of submit button
 */
const SupplierForm = ({
  open,
  onClose,
  onSubmit,
  initialValues = null,
  submitting = false,
}) => {
  const { user } = useAuth();

  // Local form state
  const [formData, setFormData] = useState({
    name: "",
    contact_person: "",
    email: "",
    phone: "",
    address: "",
  });

  // Local validation / submit error message
  const [error, setError] = useState("");

  // When dialog opens, populate existing values for edit mode
  useEffect(() => {
    if (initialValues) {
      setFormData({
        name: initialValues.name || "",
        contact_person: initialValues.contact_person || "",
        email: initialValues.email || "",
        phone: initialValues.phone || "",
        address: initialValues.address || "",
      });
    } else {
      setFormData({
        name: "",
        contact_person: "",
        email: "",
        phone: "",
        address: "",
      });
    }

    setError("");
  }, [initialValues, open]);

  // Handle input change for all text fields
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit form values back to parent page
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (
      !formData.name.trim() ||
      !formData.contact_person.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.address.trim()
    ) {
      setError("All supplier fields are required");
      return;
    }

    try {
      await onSubmit({
        user_id: user.id,
        name: formData.name.trim(),
        contact_person: formData.contact_person.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to save supplier");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {initialValues ? "Edit Supplier" : "Add Supplier"}
      </DialogTitle>

      <DialogContent>
        <Stack component="form" spacing={2} sx={{ mt: 1 }} onSubmit={handleSubmit}>
          {error && <Alert severity="error">{error}</Alert>}

          <TextField label="Supplier Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />

          <TextField label="Contact Person" name="contact_person" value={formData.contact_person} onChange={handleChange} fullWidth required />

          <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth required />

          <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth required />

          <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth multiline minRows={2} required />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" onClick={handleSubmit} disabled={submitting}>
            {
            submitting ? 
                initialValues ? "Updating..." : "Creating..." : 
                initialValues ? "Update" : "Create"
            }
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SupplierForm;