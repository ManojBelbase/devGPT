// src/api/api.ts
import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8001/api/user",
    withCredentials: true,
});
