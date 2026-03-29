import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { useToast } from "../../hooks/useToast";

// Registration page
const RegisterPage = () => {

    const navigate = useNavigate();
    const { register } = useAuth();

    // Form state
    const [formData, setFormData] = useState({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      business_name: "",
      phone: "",
      address: "",
    });

    // UI state
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Global toast helpers
    const { showSuccess, showError } = useToast();

    // Update form fields
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    // Submit registration form
    const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");
      setSuccess("");
      setSubmitting(true);

      try {
        await register(formData);
        showSuccess("Registration successful. You can now log in.");
        setTimeout(() => navigate("/login"), 1000);
      } catch (error) {
        const message = error.response.data.message || "Registration failed";
        setError(message);
        showError(message);
      } finally {
        setSubmitting(false);
      }
    };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper sx={{ p: 4, width: 500 }}>
        <Typography variant="h5" mb={3}>
          Register for JetStock
        </Typography>
        
        {/* showing error messages */}
        {/* {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )} */}

         {/* showing success messages */}
        {/* {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )} */}

        {/* Registration form */}
        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} fullWidth required />

            <TextField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} fullWidth required />

            <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth required />

            <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth required />

            <TextField label="Business Name" name="business_name" value={formData.business_name} onChange={handleChange} fullWidth required />

            <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} fullWidth />

            <TextField label="Address" name="address" value={formData.address} onChange={handleChange} fullWidth />

            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? "Registering..." : "Register"}
            </Button>

            <Button component={Link} to="/login">
              Already have an account? Login
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
