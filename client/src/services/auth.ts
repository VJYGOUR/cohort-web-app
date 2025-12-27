import api from "../axios/axios";

interface SignupData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const signupUser = (data: SignupData) => api.post("/auth/signup", data);
export const loginUser = (data: LoginData) => api.post("/auth/login", data);
export const logoutUser = () => api.post("/auth/logout");
export const getMe = () => api.get("/auth/me");
