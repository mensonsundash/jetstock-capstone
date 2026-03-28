import axiosClient from "./axiosClient";

// Fetch inventory summary values
export const getInventorySummary = async () => {
  const response = await axiosClient.get("/inventory/summary");
  return response.data;
};

// Fetch low-stock inventory items
export const getLowStockItems = async () => {
  const response = await axiosClient.get("/inventory/low-stock");
  return response.data;
};