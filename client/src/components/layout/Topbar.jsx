import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";

const Topbar = ({ drawerWidth }) => {
    //logout function from auth context
  const { logout } = useAuth();

  return (
    // fixed topbar
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
      }}
    >
        {/* headers */}
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        
        <Typography variant="h6" noWrap component="div">
          Application
        </Typography>
        
        {/* logout button */}
        <Box>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;