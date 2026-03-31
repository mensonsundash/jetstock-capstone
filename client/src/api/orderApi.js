import axiosClient from "./axiosClient";

// Fetch all orders
export const getAllOrders = async () => {
  const response = await axiosClient.get("/orders");
  return response.data;
};

// Fetch one order by id
export const getOrderById = async (id) => {
  const response = await axiosClient.get(`/orders/${id}`);
  return response.data;
};

// Create order
export const createOrder = async (payload) => {
  const response = await axiosClient.post("/orders", payload);
  return response.data;
};

// Update order status
export const updateOrderStatus = async (id, payload) => {
  const response = await axiosClient.put(`/orders/${id}`, payload);
  return response.data;
};

// Delete order
export const deleteOrder = async (id) => {
  const response = await axiosClient.delete(`/orders/${id}`);
  return response.data;
};
