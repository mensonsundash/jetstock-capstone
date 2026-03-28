import axiosClient from "./axiosClient";

// Fetch all categories from backend
export const getAllCategories = async () => {
  const response = await axiosClient.get("/categories");
  return response.data;
};

// Create a new Category
export const createCategory = async (payload) => {
  const response = await axiosClient.post("/categories", payload);
  return response.data;
}

//update category by id
export const updateCategory = async (id, payload) => {
  const response = await axiosClient.put(`/categories/${id}`, payload);
  return response.data;
}

// Delete category by id
export const deleteCategory = async (id) => {
  const response = await axiosClient.delete(`/categories/${id}`);
  return response.data;
}