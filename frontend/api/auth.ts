import api from "./axios";
import { User } from "@/lib/types";

export const login = async (username: string, password: string) => {
  const form = new FormData();
  form.append("username", username);
  form.append("password", password);

  const res = await api.post("/users/login", form, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  localStorage.setItem("access_token", res.data.access_token);
  localStorage.setItem("refresh_token", res.data.refresh_token);

  return res.data;
};


export const logout = async () => {
  try {
    await api.post("/users/logout");
  } catch (_) {}

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

export const getMe = async (): Promise<User> => {
  const res = await api.get("/users/me");
  return res.data;
};
