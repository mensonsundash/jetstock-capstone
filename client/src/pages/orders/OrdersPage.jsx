import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import Loader from "../../components/common/Loader";
import useDebounce from "../../hooks/useDebounce";
import { getAllOrders } from "../../api/orderApi";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const debouncedSearchText = useDebounce(searchText.trim(), 400);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAllOrders();
      setOrders(response?.data || []);
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const flattenedRows = useMemo(() => {
    return orders.flatMap((order) =>
      (order.items || []).map((item) => ({
        rowId: `${order.id}-${item.id}`,
        orderId: order.id,
        orderDate: order.order_date,
        orderStatus: order.status,
        orderTotal: order.total_amount,

        customerName: order.customer?.full_name || "-",
        customerEmail: order.customer?.email || "-",
        customerPhone: order.customer?.phone || "-",

        productName: item.product?.name || "-",
        sku: item.product?.sku || "-",
        productOwner:
          item.product?.user
            ? `${item.product.user.first_name || ""} ${item.product.user.last_name || ""}`.trim()
            : "-",
        businessName: item.product?.user?.business_name || "-",

        quantity: item.quantity,
        unitPrice: item.unit_price,
        subTotal: item.sub_total,
      }))
    );
  }, [orders]);

  const filteredRows = useMemo(() => {
    let rows = [...flattenedRows];

    if (debouncedSearchText) {
      const q = debouncedSearchText.toLowerCase();

      rows = rows.filter((row) => {
        return (
          String(row.orderId).toLowerCase().includes(q) ||
          String(row.customerName).toLowerCase().includes(q) ||
          String(row.customerEmail).toLowerCase().includes(q) ||
          String(row.customerPhone).toLowerCase().includes(q) ||
          String(row.productName).toLowerCase().includes(q) ||
          String(row.sku).toLowerCase().includes(q) ||
          String(row.businessName).toLowerCase().includes(q) ||
          String(row.productOwner).toLowerCase().includes(q)
        );
      });
    }

    if (statusFilter) {
      rows = rows.filter((row) => row.orderStatus === statusFilter);
    }

    switch (sortBy) {
      case "date-asc":
        rows.sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
        break;
      case "date-desc":
        rows.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        break;
      case "customer-asc":
        rows.sort((a, b) => a.customerName.localeCompare(b.customerName));
        break;
      case "customer-desc":
        rows.sort((a, b) => b.customerName.localeCompare(a.customerName));
        break;
      case "product-asc":
        rows.sort((a, b) => a.productName.localeCompare(b.productName));
        break;
      case "product-desc":
        rows.sort((a, b) => b.productName.localeCompare(a.productName));
        break;
      case "qty-asc":
        rows.sort((a, b) => Number(a.quantity) - Number(b.quantity));
        break;
      case "qty-desc":
        rows.sort((a, b) => Number(b.quantity) - Number(a.quantity));
        break;
      default:
        break;
    }

    return rows;
  }, [flattenedRows, debouncedSearchText, statusFilter, sortBy]);

  const paginatedRows = useMemo(() => {
    const startIndex = page * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredRows.slice(startIndex, endIndex);
  }, [filteredRows, page, rowsPerPage]);

  const handleResetFilters = () => {
    setSearchText("");
    setStatusFilter("");
    setSortBy("date-desc");
    setPage(0);
  };

  if (loading) return <Loader />;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Orders</Typography>
        <Typography variant="body1" color="text.secondary" mt={1}>
          View all customer order items with product and customer details
        </Typography>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper sx={{ p: 2 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "stretch", md: "center" }}
          flexDirection={{ xs: "column", md: "row" }}
          gap={2}
        >
          <Box
            display="flex"
            flexDirection={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            gap={2}
            flexWrap="wrap"
            flex={1}
          >
            <TextField
              label="Search order, customer, product, sku, business"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              sx={{ minWidth: 260, flex: 1 }}
            />

            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="order-status-filter-label">Status</InputLabel>
              <Select
                labelId="order-status-filter-label"
                value={statusFilter}
                label="Status"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="shipped">Shipped</MenuItem>
                <MenuItem value="delivered">Delivered</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 180 }}>
              <InputLabel id="order-sort-label">Sort</InputLabel>
              <Select
                labelId="order-sort-label"
                value={sortBy}
                label="Sort"
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="date-desc">Newest First</MenuItem>
                <MenuItem value="date-asc">Oldest First</MenuItem>
                <MenuItem value="customer-asc">Customer A-Z</MenuItem>
                <MenuItem value="customer-desc">Customer Z-A</MenuItem>
                <MenuItem value="product-asc">Product A-Z</MenuItem>
                <MenuItem value="product-desc">Product Z-A</MenuItem>
                <MenuItem value="qty-asc">Qty Low-High</MenuItem>
                <MenuItem value="qty-desc">Qty High-Low</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box>
            <Button
              variant="outlined"
              onClick={handleResetFilters}
              sx={{ minWidth: 120, height: 56 }}
            >
              Reset
            </Button>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        {filteredRows.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No order items found.
          </Typography>
        ) : (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Order ID</strong></TableCell>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Customer</strong></TableCell>
                  <TableCell><strong>Email</strong></TableCell>
                  <TableCell><strong>Phone</strong></TableCell>
                  <TableCell><strong>Product</strong></TableCell>
                  <TableCell><strong>SKU</strong></TableCell>
                  <TableCell><strong>Business</strong></TableCell>
                  <TableCell><strong>Owner</strong></TableCell>
                  <TableCell><strong>Qty</strong></TableCell>
                  <TableCell><strong>Unit Price</strong></TableCell>
                  <TableCell><strong>Sub Total</strong></TableCell>
                  <TableCell><strong>Order Total</strong></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {paginatedRows.map((row) => (
                  <TableRow key={row.rowId}>
                    <TableCell>{row.orderId}</TableCell>
                    <TableCell>
                      {row.orderDate ? new Date(row.orderDate).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {row.orderStatus}
                    </TableCell>
                    <TableCell>{row.customerName}</TableCell>
                    <TableCell>{row.customerEmail}</TableCell>
                    <TableCell>{row.customerPhone}</TableCell>
                    <TableCell>{row.productName}</TableCell>
                    <TableCell>{row.sku}</TableCell>
                    <TableCell>{row.businessName}</TableCell>
                    <TableCell>{row.productOwner}</TableCell>
                    <TableCell>{row.quantity}</TableCell>
                    <TableCell>${row.unitPrice}</TableCell>
                    <TableCell>${row.subTotal}</TableCell>
                    <TableCell>${row.orderTotal}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <TablePagination
              component="div"
              count={filteredRows.length}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(0);
              }}
              rowsPerPageOptions={[5, 10, 25, 50]}
            />
          </>
        )}
      </Paper>
    </Stack>
  );
};

export default OrdersPage;