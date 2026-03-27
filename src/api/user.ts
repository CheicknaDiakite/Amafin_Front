// src/api/user.ts
import Axios from "../_services/caller.service";

export interface User {
  id: number;
  username: string;
  email: string;
}

export const getUser = async (): Promise<User> => {
  const res = await Axios.get("/entreprise/user/");
  return res.data;
};
