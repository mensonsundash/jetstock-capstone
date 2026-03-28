import axiosClient from "./axiosClient";

// Fetch all stock movements
export const getAllStockMovements = async () => {
  const response = await axiosClient.get("/stock-movements");
  return response.data;
};