import axios from "axios";

// 1. Create the Axios Instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Add Interceptor (The Security Guard)
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // If Backend says "Unauthorized" (401), force logout
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ---------------------------------------------------------
// 3. Define API Calls (The "Menu" of your Backend)
// ---------------------------------------------------------

// --- AUTHENTICATION ---
export const loginUser = (data) => API.post("/users/auth/login", data);
export const registerUser = (data) => API.post("/users/auth/register", data);
export const logoutUser = () => API.post("/users/auth/logout");

// --- POSTS ---
export const fetchPosts = (page) => API.get(`/posts?page=${page}&limit=10`);

// NOTE: For file uploads, we don't set Content-Type manually. 
// Axios detects FormData and handles it.
export const createPost = (formData) => API.post("/posts/creates", formData);

// --- INTERACTIONS ---
export const likePost = (postId) => API.post(`/posts/likes/${postId}`);
export const commentOnPost = (postId, text) => API.post(`/posts/${postId}/comment`, { text });

// Export the instance in case we need custom calls elsewhere
export default API;