import { Chip } from "@mui/material";

// Reusable inventory status badge
// Shows a colored chip based on current stock level
const StatusBadge = ({ quantity, reorderLevel }) => {
  // Out of stock = quantity is zero
  if (quantity === 0) {
    return <Chip label="Out of Stock" color="error" size="small" />;
  }

  // Low stock = quantity is less than or equal to reorder level
  if (quantity <= reorderLevel) {
    return <Chip label="Low Stock" color="warning" size="small" />;
  }

  // Otherwise inventory is in a safe range
  return <Chip label="In Stock" color="success" size="small" />;
};

export default StatusBadge;