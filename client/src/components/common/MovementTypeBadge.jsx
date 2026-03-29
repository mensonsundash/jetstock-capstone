import { Chip } from "@mui/material";

// Reusable badge for stock movement type
// IN = green
// OUT = error color
const MovementTypeBadge = ({ type }) => {
  if (type === "IN") {
    return <Chip label="Stock In" color="success" size="small" />;
  }

  if (type === "OUT") {
    return <Chip label="Stock Out" color="error" size="small" />;
  }

  return <Chip label={type || "Unknown"} size="small" />;
};

export default MovementTypeBadge;