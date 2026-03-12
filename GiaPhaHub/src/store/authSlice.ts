import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  AuthService,
  type LoginRequest,
  type RegisterRequest,
} from "@/services/authService";

interface AuthState {
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken"),
  loading: false,
  error: null,
};

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
  }
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
  }
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
  }
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
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.accessToken;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.accessToken = null;
        localStorage.removeItem("accessToken");
      })
      .addCase(logout.rejected, (state) => {
        state.accessToken = null;
        localStorage.removeItem("accessToken");
      });

    // Refresh token
    builder
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken;
        localStorage.setItem("accessToken", action.payload.accessToken);
      })
      .addCase(refreshToken.rejected, (state) => {
        state.accessToken = null;
        localStorage.removeItem("accessToken");
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
