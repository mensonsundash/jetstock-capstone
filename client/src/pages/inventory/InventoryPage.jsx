import { Alert, Box, Button, FormControl, Grid, IconButton, InputLabel, MenuItem, Paper, Select, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";


import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import CancelIcon from "@mui/icons-material/Cancel";
import WarehouseIcon from "@mui/icons-material/Warehouse";

import Loader from "../../components/common/Loader";
import DashboardCard from "../../components/layout/DashboardCard";

import {
  getAllInventory,
  getInventorySummary,
  getLowStockItems,
  getOutOfStockItems,
} from "../../api/inventoryApi";
import StatusBadge from "../../components/common/StatusBadge";

// Inventory page
// Shows summary cards, low stock section, out-of-stock section,
// and the full inventory table with stock status badges
const InventoryPage = () => {
  // Inventory datasets states
  const [inventoryItems, setInventoryItems] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [outOfStockItems, setOutOfStockItems] = useState([]);

  // Summary values states
  const [summary, setSummary] = useState({
    totalProducts: 0,
    totalQuantity: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
  });

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all inventory-related data
  const fetchInventoryPageData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        inventoryResponse,
        summaryResponse,
        lowStockResponse,
        outOfStockResponse,
      ] = await Promise.all([
        getAllInventory(),
        getInventorySummary(),
        getLowStockItems(),
        getOutOfStockItems(),
      ]);

      setInventoryItems(inventoryResponse?.data || []);
      setSummary(summaryResponse?.data || {});
      setLowStockItems(lowStockResponse?.data || []);
      setOutOfStockItems(outOfStockResponse?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load inventory data");
    } finally {
      setLoading(false);
    }
  };

  // Load inventory data on first render
  useEffect(() => {
    fetchInventoryPageData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Stack spacing={3}>
      {/* Page header */}
      <Box>
        <Typography variant="h4">Inventory</Typography>
        <Typography variant="body1" color="text.secondary" mt={1}>
          Monitor stock levels, low-stock alerts, and full inventory records
        </Typography>
      </Box>

      {/* Error message */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Summary cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Products"
            value={summary.totalProducts || 0}
            icon={<Inventory2Icon fontSize="inherit" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Quantity"
            value={summary.totalQuantity || 0}
            icon={<WarehouseIcon fontSize="inherit" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Low Stock Items"
            value={summary.lowStockCount || 0}
            icon={<WarningAmberIcon fontSize="inherit" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Out of Stock"
            value={summary.outOfStockCount || 0}
            icon={<CancelIcon fontSize="inherit" />}
          />
        </Grid>
      </Grid>

      {/* Alert sections */}
      <Grid container spacing={3}>
        {/* Low stock section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" mb={2}>
              Low Stock Items
            </Typography>

            {lowStockItems.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No low stock items found.
              </Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Product</strong></TableCell>
                    <TableCell><strong>Qty</strong></TableCell>
                    <TableCell><strong>Reorder</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {lowStockItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product?.name || "-"}</TableCell>
                      <TableCell>{item.quantity_on_hand}</TableCell>
                      <TableCell>{item.reorder_level}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>

        {/* Out of stock section */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography variant="h6" mb={2}>
              Out of Stock Items
            </Typography>

            {outOfStockItems.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No out-of-stock items found.
              </Typography>
            ) : (
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Product</strong></TableCell>
                    <TableCell><strong>Location</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {outOfStockItems.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.product?.name || "-"}</TableCell>
                      <TableCell>{item.location || "-"}</TableCell>
                      <TableCell>
                        <StatusBadge
                          quantity={item.quantity_on_hand}
                          reorderLevel={item.reorder_level}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Full inventory table */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Full Inventory
        </Typography>

        {inventoryItems.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No inventory records found.
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Product</strong></TableCell>
                <TableCell><strong>SKU</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Reorder Level</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {inventoryItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.product?.name || "-"}</TableCell>
                  <TableCell>{item.product?.sku || "-"}</TableCell>
                  <TableCell>{item.quantity_on_hand}</TableCell>
                  <TableCell>{item.reorder_level}</TableCell>
                  <TableCell>{item.location || "-"}</TableCell>
                  <TableCell>
                    <StatusBadge
                      quantity={item.quantity_on_hand}
                      reorderLevel={item.reorder_level}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </Stack>
  );
};

export default InventoryPage;