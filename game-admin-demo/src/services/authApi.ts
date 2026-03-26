import http from "./http";

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = {
  access_token: string;
  token_type: string;
};

export const loginApi = async (data: LoginRequest) => {
  const res = await http.post<LoginResponse>("/auth/login", data);
  return res.data;
};