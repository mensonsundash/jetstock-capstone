import { AppBar, Toolbar, Typography, Box, Button } from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

// Top Bar: navigation bar shown on all protected pages
const Topbar = ({ drawerWidth }) => {
  //logout function from auth context
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout= () => {
    logout();
    navigate("/login");
  }

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
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body2">
              {user ? `${user.first_name || ""} ${user.last_name || "" } `. trim() : "User"}
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;