import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Grid, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";

import Loader from "../../components/common/Loader";
import MovementTypeBadge from "../../components/common/MovementTypeBadge";
import StatusBadge from "../../components/common/StatusBadge";
import DashboardCard from "../../components/layout/DashboardCard";
import ReportBarChart from "../../components/reports/ReportBarChart";
import { getStockMovementReport, getInventorySummaryReport, getLowStockReport, } from "../../api/reportApi";

// Reports page
// Displays: - summary cards, report chart, stock movement report table, inventory summary report table, low stock report table
const ReportsPage = () => {
  // Report datasets states
  const [stockMovements, setStockMovements] = useState([]);
  const [inventorySummary, setInventorySummary] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load all report data in parallel
  const fetchReportsData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        stockMovementsResponse,
        inventorySummaryResponse,
        lowStockResponse,
      ] = await Promise.all([
        getStockMovementReport(),
        getInventorySummaryReport(),
        getLowStockReport(),
      ]);

      setStockMovements(stockMovementsResponse?.data || []);
      setInventorySummary(inventorySummaryResponse?.data || []);
      setLowStockItems(lowStockResponse?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportsData();
  }, []);

  // Summary card values
  const summaryCards = useMemo(() => {
    return {
      stockMovementCount: stockMovements.length,
      inventoryCount: inventorySummary.length,
      lowStockCount: lowStockItems.length,
      totalInventoryQty: inventorySummary.reduce(
        (sum, item) => sum + Number(item.quantity_on_hand || 0),
        0
      ),
    };
  }, [stockMovements, inventorySummary, lowStockItems]);

  // Chart data
  const chartData = useMemo(() => {
    return [
      { name: "Stock Movements", value: stockMovements.length },
      { name: "Inventory Items", value: inventorySummary.length },
      { name: "Low Stock", value: lowStockItems.length },
      {
        name: "Total Qty",
        value: inventorySummary.reduce(
          (sum, item) => sum + Number(item.quantity_on_hand || 0),
          0
        ),
      },
    ];
  }, [stockMovements, inventorySummary, lowStockItems]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Stack spacing={3}>
      {/* Page header */}
      <Box>
        <Typography variant="h4">Reports</Typography>
        <Typography variant="body1" color="text.secondary" mt={1}>
          Review movement trends, inventory summary, and low stock alerts
        </Typography>
      </Box>

      {/* Error state */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Top summary cards */}
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Stock Movements"
            value={summaryCards.stockMovementCount}
            icon={<SwapHorizIcon fontSize="inherit" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Inventory Records"
            value={summaryCards.inventoryCount}
            icon={<Inventory2Icon fontSize="inherit" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Low Stock Items"
            value={summaryCards.lowStockCount}
            icon={<WarningAmberIcon fontSize="inherit" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Inventory Qty"
            value={summaryCards.totalInventoryQty}
            icon={<AssessmentIcon fontSize="inherit" />}
          />
        </Grid>
      </Grid>

      {/* Chart section */}
      <ReportBarChart data={chartData} />

      {/* Stock movement report */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Stock Movement Report
        </Typography>

        {stockMovements.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No stock movement report data found.
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Product</strong></TableCell>
                <TableCell><strong>SKU</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Source</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {stockMovements.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.product?.name || "-"}</TableCell>
                  <TableCell>{item.product?.sku || "-"}</TableCell>
                  <TableCell>
                    <MovementTypeBadge type={item.movement_type} />
                  </TableCell>
                  <TableCell>{item.source_type || "-"}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>
                    {item.movement_date
                      ? new Date(item.movement_date).toLocaleDateString()
                      : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* Inventory summary report */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Inventory Summary Report
        </Typography>

        {inventorySummary.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No inventory summary data found.
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Product</strong></TableCell>
                <TableCell><strong>SKU</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Supplier</strong></TableCell>
                <TableCell><strong>Price</strong></TableCell>
                <TableCell><strong>Qty</strong></TableCell>
                <TableCell><strong>Reorder</strong></TableCell>
                <TableCell><strong>Location</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {inventorySummary.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product?.name || "-"}</TableCell>
                  <TableCell>{item.product?.sku || "-"}</TableCell>
                  <TableCell>{item.product?.category?.name || "-"}</TableCell>
                  <TableCell>{item.product?.supplier?.name || "-"}</TableCell>
                  <TableCell>${item.product?.price || "-"}</TableCell>
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

      {/* Low stock report */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          Low Stock Report
        </Typography>

        {lowStockItems.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No low stock items found.
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Product</strong></TableCell>
                <TableCell><strong>SKU</strong></TableCell>
                <TableCell><strong>Category</strong></TableCell>
                <TableCell><strong>Supplier</strong></TableCell>
                <TableCell><strong>Qty</strong></TableCell>
                <TableCell><strong>Reorder</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {lowStockItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.product?.name || "-"}</TableCell>
                  <TableCell>{item.product?.sku || "-"}</TableCell>
                  <TableCell>{item.product?.category?.name || "-"}</TableCell>
                  <TableCell>{item.product?.supplier?.name || "-"}</TableCell>
                  <TableCell>{item.quantity_on_hand}</TableCell>
                  <TableCell>{item.reorder_level}</TableCell>
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

export default ReportsPage;