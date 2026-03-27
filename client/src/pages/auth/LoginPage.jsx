import { Box, Paper, Typography } from "@mui/material";

// login page
const LoginPage = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h5">Login Page</Typography>
      </Paper>
    </Box>
  );
};

export default LoginPage;
