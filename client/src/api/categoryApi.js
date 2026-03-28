import axiosClient from "./axiosClient";

// Fetch all categories from backend
export const getAllCategories = async () => {
  const response = await axiosClient.get("/categories");
  return response.data;
};