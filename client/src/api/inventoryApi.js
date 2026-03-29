import axiosClient from "./axiosClient";

// Fetch all inventory records
export const getAllInventory = async () => {
  const response = await axiosClient.get("/inventory");
  return response.data;
}

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

// Fetch out-of-stock items
export const getOutOfStockItems = async() => {
  const response = await axiosClient.get("/inventory/out-of-stock");
  return response.data;
}