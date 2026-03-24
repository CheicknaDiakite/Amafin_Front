// src/api/user.ts
import { apiClient } from "./apiClient";

export interface User {
  id: number;
  username: string;
  email: string;
}

export const getUser = async (): Promise<User> => {
  const res = await apiClient.get("user/");
  return res.data;
};
