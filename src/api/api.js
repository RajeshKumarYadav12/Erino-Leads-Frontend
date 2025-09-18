import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // important to send httpOnly cookie
  headers: {
    "Content-Type": "application/json",
  },
});

// auth
export const authApi = {
  login: (payload) => API.post("/auth/login", payload).then((r) => r.data),
  register: (payload) =>
    API.post("/auth/register", payload).then((r) => r.data),
  logout: () => API.post("/auth/logout").then((r) => r.data),
  me: () => API.get("/auth/me").then((r) => r.data),
};

// leads
export const leadsApi = {
  list: (params) => API.get("/leads", { params }).then((r) => r.data),
  get: (id) => API.get(`/leads/${id}`).then((r) => r.data),
  create: (payload) => API.post("/leads", payload).then((r) => r.data),
  update: (id, payload) => API.put(`/leads/${id}`, payload).then((r) => r.data),
  remove: (id) => API.delete(`/leads/${id}`).then((r) => r.data),
};

export default API;
