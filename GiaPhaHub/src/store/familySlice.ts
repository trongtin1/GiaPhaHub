
import { createSlice, createAsyncThunk, createSelector, type PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
import type { RootState } from "./index";
import type { FamilyMember } from "@/types";
import type { ResourceState } from "@/mocks/ResourceState";
import { SAMPLE_DATA } from "@/mocks/family";
import { FamilyService } from "@/services/familyService";

// ── localStorage ──────────────────────────────────────────────
const STORAGE_KEY = "GiaPhaHub-data";

export function loadFromStorage(): FamilyMember[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as FamilyMember[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // corrupted data → fall through to sample
  }
  return SAMPLE_DATA;
}

export function saveToStorage(members: FamilyMember[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
}

/** Fetch all members từ BE */
export const fetchMembers = createAsyncThunk<FamilyMember[]>(
  "family/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await FamilyService.getAll();
      return res.data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

/** Thêm thành viên qua BE */
export const createMember = createAsyncThunk<
  FamilyMember,
  Omit<FamilyMember, "id">
>(
  "family/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = await FamilyService.create(data);
      return res.data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

/** Cập nhật thành viên qua BE */
export const editMember = createAsyncThunk<FamilyMember, FamilyMember>(
  "family/edit",
  async (data, { rejectWithValue }) => {
    try {
      const res = await FamilyService.update(data.id, data);
      return res.data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

/** Xóa thành viên qua BE */
export const removeMember = createAsyncThunk<string, string>(
  "family/remove",
  async (id, { rejectWithValue }) => {
    try {
      await FamilyService.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

// ── State shape ───────────────────────────────────────────────
export type FamilyState = ResourceState<FamilyMember[]>;

const initialState: FamilyState = {
  data: loadFromStorage(),
  loading: false,
  error: null,
};

// ── Slice ─────────────────────────────────────────────────────
const familySlice = createSlice({
  name: "family",
  initialState,
  reducers: {
    loadMembers(state, action: PayloadAction<FamilyMember[]>) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },

    addMember(state, action: PayloadAction<Omit<FamilyMember, "id">>) {
      state.data.push({ ...action.payload, id: uuidv4() });
    },

    updateMember(state, action: PayloadAction<FamilyMember>) {
      const idx = state.data.findIndex((m) => m.id === action.payload.id);
      if (idx !== -1) state.data[idx] = action.payload;
    },

    deleteMember(state, action: PayloadAction<string>) {
      const id = action.payload;
      state.data = state.data
        .filter((m) => m.id !== id)
        .map((m) => ({
          ...m,
          parentId: m.parentId === id ? undefined : m.parentId,
          spouseId: m.spouseId === id ? undefined : m.spouseId,
        }));
    },
  },

  extraReducers: (builder) => {
    builder
      // fetchMembers
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      // createMember
      .addCase(createMember.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      // editMember
      .addCase(editMember.fulfilled, (state, action) => {
        const idx = state.data.findIndex((m) => m.id === action.payload.id);
        if (idx !== -1) state.data[idx] = action.payload;
      })
      // removeMember
      .addCase(removeMember.fulfilled, (state, action) => {
        const id = action.payload;
        state.data = state.data
          .filter((m) => m.id !== id)
          .map((m) => ({
            ...m,
            parentId: m.parentId === id ? undefined : m.parentId,
            spouseId: m.spouseId === id ? undefined : m.spouseId,
          }));
      });
  },
});

export const {
  loadMembers,
  addMember,
  updateMember,
  deleteMember,
} = familySlice.actions;

export default familySlice.reducer;

// ── Selectors ─────────────────────────────────────────────────
export const selectAllMembers = (state: RootState) => state.family.data;
export const selectFamilyLoading = (state: RootState) => state.family.loading;
export const selectFamilyError = (state: RootState) => state.family.error;

/** Tìm một thành viên theo id */
export const selectMemberById = createSelector(
  [selectAllMembers, (_: RootState, id: string) => id],
  (members, id) => members.find((m) => m.id === id),
);

/** Lấy danh sách con của một thành viên */
export const selectChildren = createSelector(
  [selectAllMembers, (_: RootState, parentId: string) => parentId],
  (members, parentId) => members.filter((m) => m.parentId === parentId),
);

/** Lấy vợ / chồng của một thành viên */
export const selectSpouse = createSelector(
  [selectAllMembers, (_: RootState, memberId: string) => memberId],
  (members, memberId) => {
    const member = members.find((m) => m.id === memberId);
    if (member?.spouseId) return members.find((m) => m.id === member.spouseId);
    return members.find((m) => m.spouseId === memberId);
  },
);

/** Lấy cha / mẹ của một thành viên */
export const selectParent = createSelector(
  [selectAllMembers, (_: RootState, memberId: string) => memberId],
  (members, memberId) => {
    const member = members.find((m) => m.id === memberId);
    if (member?.parentId) return members.find((m) => m.id === member.parentId);
    return undefined;
  },
);

/** Lấy danh sách các thành viên gốc (không có cha, không là vợ/chồng) */
export const selectRootMembers = createSelector(
  [selectAllMembers],
  (members) => members.filter((m) => !m.parentId && !m.spouseId),
);
