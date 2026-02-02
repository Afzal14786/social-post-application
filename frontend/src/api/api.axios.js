import axios from "axios";

/**
 * @description Configure API
 */
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * @description API Interceptor Request
 */
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

/**
 * @description API Interecptor Response
 */
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

/**
 * 
 * @param {userdata} data User can enter details
 * @param {signin} login using required email & password
 * @param {signup} signup user create a new account 
 * @returns a new user if {signup} or login to '/' once user login
 */
export const loginUser = (data) => API.post("/users/auth/login", data);
export const registerUser = (data) => API.post("/users/auth/register", data);
export const logoutUser = () => API.post("/users/auth/logout");

/**
 * 
 * @param {number} page 
 * @param {number} limit 
 * @returns only return a fixed no of posts at a time.
 */
export const fetchPosts = (page = 1, limit = 10) => API.get(`/posts?page=${page}&limit=${limit}`);

/**
 * 
 * @param {formData} formData User can enter text and images
 * @returns Create a new post in the database
 */
export const createPost = (formData) => API.post("/posts/creates", formData, {
  headers: { "Content-Type": "multipart/form-data" },
});

/**
 * 
 * @param {postId} postId User is liking a specific post
 * @param {*} text User can enter comment . 
 * @returns A new comment is created
 */
export const commentOnPost = (postId, text) => API.post(`/posts/${postId}/comment`, { text });

/**
 * 
 * @param {postId} postId User like a post
 * @returns A post is liked
 */
export const likePost = (postId) => API.post(`/posts/${postId}/like`);

export default API;