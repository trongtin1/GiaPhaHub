import axios from "./axios";
import type { BaseResponse } from "../models/ResponseModels";

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export const AuthService = {
  register: async (
    payload: RegisterRequest
  ): Promise<BaseResponse<AuthResponse>> => {
    return await axios({
      method: "post",
      url: "/Auth/register",
      data: payload,
    });
  },

  login: async (
    payload: LoginRequest
  ): Promise<BaseResponse<AuthResponse>> => {
    return await axios({
      method: "post",
      url: "/Auth/login",
      data: payload,
    });
  },

  refreshToken: async (): Promise<BaseResponse<AuthResponse>> => {
    return await axios({
      method: "post",
      url: "/Auth/refresh-token",
    });
  },

  logout: async (): Promise<BaseResponse<boolean>> => {
    return await axios({
      method: "post",
      url: "/Auth/logout",
    });
  },
};
