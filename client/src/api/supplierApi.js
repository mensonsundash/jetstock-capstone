import axiosClient from "./axiosClient";

// Fetch all suppliers from backend
export const getAllSuppliers = async () => {
  const response = await axiosClient.get("/suppliers");
  return response.data;
};

// Create a new supplier
export const createSupplier = async (payload) => {
  const response = await axiosClient.post("/suppliers", payload);
  return response.data;
};

// Update supplier by id
export const updateSupplier = async (id, payload) => {
  const response = await axiosClient.put(`/suppliers/${id}`, payload);
  return response.data;
};

// Delete supplier by id
export const deleteSupplier = async (id) => {
  const response = await axiosClient.delete(`/suppliers/${id}`);
  return response.data;
};