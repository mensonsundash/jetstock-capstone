import axiosClient from "./axiosClient"

// Fetch all products from backend
export const getAllProduct = async () => {
    const response = await axiosClient.get("/products");
    return response.data;
}