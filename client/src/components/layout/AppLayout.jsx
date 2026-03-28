import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import icon from "../../assets/logo.svg";

const drawerWidth = 240;

// Dashboard Body: main page body to display pages as outlet
const AppLayout = () => {
  return (
    // flex body to fit content
    <Box sx={{ display: "flex" }}>
        {/* Example icon/logo */}
        <Box
          component="img"
          src={icon}
          alt="JetStock Logo"
          sx={{
            width: 200,
            position: "fixed",
            top: 10,
            left: 10,
            zIndex: 2000,
          }}
        />
        {/* Topbar: fixed topbar with logout */}
        <Topbar drawerWidth={drawerWidth} />
        {/* Sidebar: drawer sidebar with list of pages routes */}
        <Sidebar drawerWidth={drawerWidth} />

        

        {/* Content: main body frame where content changes */}
        <Box
            component="main"
            sx={{
            flexGrow: 1,
            p: 3,
            backgroundColor: "background.default",
            minHeight: "100vh",
            }}
        >
            <Toolbar />
            {/* Outlet Renderer: content according to routes inside layout*/}
            <Outlet />
        </Box>
    </Box>
  );
};

export default AppLayout;