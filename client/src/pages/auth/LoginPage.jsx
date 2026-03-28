import { Alert, Box, Button, Paper, Stack, TextField, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";

// login page
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  // UI state
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // updating form fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // submit login form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(formData.email, formData.password);
      navigate("/dashboard");
    } catch(error) {
      setError(error.response.data.message || "Login failed")
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
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" mb={3}>Login to JetStock</Typography>
        
        {/* showing error messages */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} fullWidth required />
            <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} fullWidth required />

            <Button type="submit" variant="contained" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </Button>

            <Button component={Link} to="/register">
                Don't have an account? Register
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default LoginPage;
