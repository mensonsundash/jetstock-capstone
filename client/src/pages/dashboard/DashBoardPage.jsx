import { Alert, Box, Grid, List, ListItem, ListItemText, Paper, Stack, Typography } from "@mui/material";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import CategoryIcon from "@mui/icons-material/Category";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { useEffect, useState } from "react";
import { getAllProducts } from "../../api/productApi";
import { getAllCategories } from "../../api/categoryApi";
import { getAllSuppliers } from "../../api/supplierApi";
import { getInventorySummary, getLowStockItems } from "../../api/inventoryApi";
import { getAllStockMovements } from "../../api/stockMovementApi";

import Loader from "../../components/common/Loader";
import DashboardCard from "../../components/layout/DashboardCard";


// Dashboard page
//using useEffect to fetch backend data when page loads
// displays summary cards, low stock items, recent stocko movements
const DashboardPage = () => {
  // dashboard states
   const [dashboardData, setDashboardData] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalSuppliers: 0,
    lowStockCount: 0,
    lowStockItems: [],
    recentMovements: [],
  });

  // Loading / error UI states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load all dashboard data
  const fetchDashboardData = async () => {
    try{
      setLoading(true);
      setError("");
      
      // Run requests through api calling from promise all succeded
      const [
        productsResponse,
        categoriesResponse,
        suppliersResponse,
        inventorySummaryResponse,
        lowStockResponse,
        stockMovementsResponse,
      ] = await Promise.all([
        getAllProducts(),
        getAllCategories(),
        getAllSuppliers(),
        getInventorySummary(),
        getLowStockItems(),
        getAllStockMovements()
      ]);

      //calling set dasbord data function: changing state value
      setDashboardData({
        totalProducts: productsResponse.data.length || 0,
        totalCategories: categoriesResponse.data.length || 0,
        totalSuppliers: suppliersResponse.data.length || 0,
        lowStockCount:  inventorySummaryResponse.data.lowStockCount || 0,
        lowStockItems: lowStockResponse.data || [],
        recentMovements: (stockMovementsResponse.data || []).slice(0,5)
      });


    } catch(error) {
      setError(error.response.data.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // useEffect: Run once when dashbord page mounted
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // show loader while data is being fetched
  if(loading) {
    return <Loader />
  }

  console.log("All data: ", dashboardData)

  return (
      <Stack spacing={3}>
        {/* Page heading */}
        <Box>
          <Typography variant="h4">Dashboard</Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Overview of your JetStock inventory and activity
          </Typography>
        </Box>

        {/* Error message if API loading fails */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Summary cards */}
        <Grid container spacing={3}>
            {/* responsive according to device */}
            
            {/* Grid re-use of dashboard card showing product details */}
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard 
              title="Total Products"
              value={dashboardData.totalProducts}
              icon={<Inventory2Icon fontSize="inherit" />}
              />
            </Grid>

            {/* Grid re-use of dashboard card showing categories details */}
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard 
              title="Total Categories"
              value={dashboardData.totalCategories}
              icon={<CategoryIcon fontSize="inherit" />}
              />
            </Grid>

            {/* Grid re-use of dashboard card showing supplier details */}
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard 
              title="Total Suppliers"
              value={dashboardData.totalSuppliers}
              icon={<LocalShippingIcon fontSize="inherit" />}
              />
            </Grid>

            {/* Grid re-use of dashboard card showing lowstock */}
            <Grid item xs={12} sm={6} md={3}>
              <DashboardCard 
              title="Low Stock Items"
              value={dashboardData.lowStockCount}
              icon={<WarningAmberIcon fontSize="inherit" />}
              />
            </Grid>
        </Grid>

        {/* Lower dashboard sections */}
        <Grid container spacing={3}>
              {/* Low stock list */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" mb={2}>
                    Low Stock Items
                  </Typography>

                  {dashboardData.lowStockItems.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No low stock items found.
                    </Typography>
                  ) : (
                    <List>
                      {dashboardData.lowStockItems.map((item) => (
                        <ListItem key={item.id} divider>
                          <ListItemText
                            primary={item.product?.name || "Unknown Product"}
                            secondary={`Available: ${item.quantity_on_hand} | Reorder Level: ${item.reorder_level}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </Grid>
              
              {/* Recent stock movements */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" mb={2}>
                    Recent Stock Movements
                  </Typography>

                  {dashboardData.recentMovements.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No stock movement history found.
                    </Typography>
                  ) : (
                    <List>
                      {dashboardData.recentMovements.map((movement) => (
                        <ListItem key={movement.id} divider>
                          <ListItemText
                            primary={movement.product?.name || "Unknown Product"}
                            secondary={`Type: ${movement.movement_type} | Qty: ${movement.quantity}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Paper>
              </Grid>     

        </Grid>

      </Stack>
  );
};

export default DashboardPage;
