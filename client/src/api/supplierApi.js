import axiosClient from "./axiosClient";

// Fetch all suppliers from backend
export const getAllSuppliers = async () => {
  const response = await axiosClient.get("/suppliers");
  return response.data;
};