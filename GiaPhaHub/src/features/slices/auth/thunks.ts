import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  AuthService,
  type LoginRequest,
  type RegisterRequest,
} from "@/services/authService";

export const login = createAsyncThunk(
  "auth/login",
  async (payload: LoginRequest, { rejectWithValue }) => {
    try {
      const res = await AuthService.login(payload);
      if (res.isSuccess) return res.data;
      return rejectWithValue(res.message);
    } catch (err: unknown) {
      const error = err as { message?: string };
      return rejectWithValue(error.message || "Đăng nhập thất bại");
    }
  },
);

export const register = createAsyncThunk(
  "auth/register",
  async (payload: RegisterRequest, { rejectWithValue }) => {
    try {
      const res = await AuthService.register(payload);
      if (res.isSuccess) return res.data;
      return rejectWithValue(res.message);
    } catch (err: unknown) {
      const error = err as { message?: string };
      return rejectWithValue(error.message || "Đăng ký thất bại");
    }
  },
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await AuthService.logout();
    } catch (err: unknown) {
      const error = err as { message?: string };
      return rejectWithValue(error.message || "Đăng xuất thất bại");
    }
  },
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const res = await AuthService.refreshToken();
      if (res.isSuccess) return res.data;
      return rejectWithValue(res.message);
    } catch (err: unknown) {
      const error = err as { message?: string };
      return rejectWithValue(error.message || "Không thể làm mới token");
    }
  },
);
