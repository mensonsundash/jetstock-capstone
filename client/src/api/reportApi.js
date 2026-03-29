import axiosClient from "./axiosClient";

// Fetch stock movement report
export const getStockMovementReport = async () => {
  const response = await axiosClient.get("/reports/stock-movements");
  return response.data;
};

// Fetch inventory summary report
export const getInventorySummaryReport = async () => {
  const response = await axiosClient.get("/reports/inventory-summary");
  return response.data;
};

// Fetch low stock report
export const getLowStockReport = async () => {
  const response = await axiosClient.get("/reports/low-stock");
  return response.data;
};