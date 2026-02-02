import axios from "axios";

// 1. Create the Axios Instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the token
API.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    if (user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser?.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// --- AUTH ---
export const loginUser = (data) => API.post("/users/auth/login", data);
export const registerUser = (data) => API.post("/users/auth/register", data);
export const logoutUser = () => API.post("/users/auth/logout");

// --- POSTS ---
export const fetchPosts = (page = 1, limit = 10) => API.get(`/posts?page=${page}&limit=${limit}`);


export const createPost = (formData) => API.post("/posts/creates", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

// --- INTERACTIONS ---
export const commentOnPost = (postId, text) => API.post(`/posts/${postId}/comment`, { text });

export const likePost = (postId) => API.post(`/posts/${postId}/like`);

export default API;