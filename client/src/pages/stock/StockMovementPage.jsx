import { useEffect, useState } from "react";
import { Alert, Paper, Stack, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";

import Loader from "../../components/common/Loader";
import MovementTypeBadge from "../../components/common/MovementTypeBadge";
import { getAllStockMovements } from "../../api/stockMovementApi";


// Stock movement history page
// Displays all stock in / stock out records in reverse recent order
const StockMovementPage = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load stock movement history
  const fetchMovements = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllStockMovements();
      setMovements(response?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load stock movements");
    } finally {
      setLoading(false);
    }
  };

  // Initial page load for once
  useEffect(() => {
    fetchMovements();
  }, []);

  // Loader UI
  if (loading) {
    return <Loader />;
  }

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="h4">Stock Movements</Typography>
        <Typography variant="body1" color="text.secondary" mt={1}>
          View stock in and stock out history across products
        </Typography>
      </div>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ p: 3 }}>
        {movements.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No stock movement records found.
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Product</strong></TableCell>
                <TableCell><strong>Type</strong></TableCell>
                <TableCell><strong>Source</strong></TableCell>
                <TableCell><strong>Quantity</strong></TableCell>
                <TableCell><strong>Note</strong></TableCell>
                <TableCell><strong>Date</strong></TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{movement.id}</TableCell>
                  <TableCell>{movement.product?.name || "-"}</TableCell>
                  <TableCell>
                    <MovementTypeBadge type={movement.movement_type} />
                  </TableCell>
                  <TableCell>{movement.source_type || "-"}</TableCell>
                  <TableCell>{movement.quantity}</TableCell>
                  <TableCell>{movement.note || "-"}</TableCell>
                  <TableCell>
                    {movement.movement_date
                      ? new Date(movement.movement_date).toLocaleDateString()
                      : "-"}
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

export default StockMovementPage;