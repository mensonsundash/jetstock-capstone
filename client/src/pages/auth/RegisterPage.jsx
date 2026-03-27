import { Box, Paper, Typography } from "@mui/material";

// Registration page
const RegisterPage = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5">Register Page</Typography>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
