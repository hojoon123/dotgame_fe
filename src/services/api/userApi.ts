// services/api/userApi.ts
import allowAnyApiClient from "./client";
import { LoginResponse, RegisterResponse } from "./types";

export async function registerUser(
  username: string,
  password: string
): Promise<RegisterResponse> {
  const response = await allowAnyApiClient.post("/users/register/", { username, password });
  return response.data;
}

export async function loginUser(
  username: string,
  password: string
): Promise<LoginResponse> {
  const response = await allowAnyApiClient.post("/users/login/", { username, password });
  return response.data;
}
