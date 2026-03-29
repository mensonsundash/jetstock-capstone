import axiosClient from "./axiosClient"

// Fetch all products from backend including query parameter for searching/filtering
export const getAllProducts = async (params = {}) => {
    const response = await axiosClient.get("/products", { params });
    return response.data;
}

// Create a new product
export const createProduct = async (payload) => {
  const response = await axiosClient.post("/products", payload);
  return response.data;
};

// Update product by id
export const updateProduct = async (id, payload) => {
  const response = await axiosClient.put(`/products/${id}`, payload);
  return response.data;
};

// Delete product by id
export const deleteProduct = async (id) => {
  const response = await axiosClient.delete(`/products/${id}`);
  return response.data;
};