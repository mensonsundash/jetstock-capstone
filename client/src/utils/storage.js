export const storage = {
    // Set token for the current browser session
    setToken: (token) => sessionStorage.setItem("token", token),

    // Get token from the current browser session
    getToken: () => sessionStorage.getItem("token"),

    // Remove token from the current browser session on logout
    removeToken: () => sessionStorage.removeItem("token"),

    // Set logged-in user details
    setUser: (user) => sessionStorage.setItem("user", JSON.stringify(user)),

    // Get logged-in user details or reset user
    getUser: () => {
        const user = sessionStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    },

    // Remove user details on logout
    removeUser: () => sessionStorage.removeItem("user"),

    // Clear all auth-realated session data
    clearAuth: () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user");
    }

}