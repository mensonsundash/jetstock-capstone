import axiosClient from "./axiosClient"


// Register a new user
export const registerUser = async (payload) => {
    const response = await axiosClient.post("/auth/register", payload);
    return response.data;
};

// Login user and receive JWT token
export const loginUser = async (payload) => {
    const response = await axiosClient.post("/auth/login", payload);
    return response.data;
};

// Fetch current logged-in user profile using JWT token provided
export const getProfile = async (payload) => {
    const response = await axiosClient.get("/auth/profile", payload);
    return response.data;
}