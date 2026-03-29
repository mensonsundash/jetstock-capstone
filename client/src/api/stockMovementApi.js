import axiosClient from "./axiosClient";

// Fetch all stock movements
export const getAllStockMovements = async () => {
  const response = await axiosClient.get("/stock-movements");
  return response.data;
};

// Create stock-in record using dedicated backend endpoint
export const stockInProduct = async (payload) => {
  const response = await axiosClient.post("/stock-movements/stock-in", payload);
  return response.data;
};

// Create stock-out record using dedicated backend endpoint
export const stockOutProduct = async (payload) => {
  const response = await axiosClient.post("/stock-movements/stock-out", payload);
  return response.data;
};

