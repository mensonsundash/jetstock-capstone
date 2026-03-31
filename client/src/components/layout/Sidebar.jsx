import { Drawer, Toolbar, List, ListItemButton, ListItemIcon, ListItemText, } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarehouseIcon from "@mui/icons-material/Warehouse";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import InputIcon from "@mui/icons-material/Input";
import OutputIcon from "@mui/icons-material/Output";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import { NavLink } from "react-router-dom";

// list of sidebar with its path and icon pack
const menuItems = [
  { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { text: "Categories", path: "/categories", icon: <CategoryIcon /> },
  { text: "Suppliers", path: "/suppliers", icon: <LocalShippingIcon /> },
  { text: "Products", path: "/products", icon: <Inventory2Icon /> },
  { text: "Inventory", path: "/inventory", icon: <WarehouseIcon /> },
  { text: "Stock In", path: "/stock-in", icon: <InputIcon /> },
  { text: "Stock Out", path: "/stock-out", icon: <OutputIcon /> },
  { text: "Stock Movements", path: "/stock-movements", icon: <SwapHorizIcon /> },
  { text: "Orders", path: "/orders", icon: <ReceiptLongIcon /> },
  { text: "Reports", path: "/reports", icon: <AssessmentIcon /> },
];

// sidbar toolbar with list menus
const Sidebar = ({ drawerWidth }) => {
  return (
    // body to open sidebar
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
    >
        {/* top toolbar */}
      <Toolbar />
      {/* side list of menus */}
      <List>
        {/* map menu items to lists as buttons & make acive when clicked*/}
        {menuItems.map((item) => (
            // listing items with path link to routes
          <ListItemButton
            key={item.text}
            component={NavLink}
            to={item.path}
            sx={{
              "&.active": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;