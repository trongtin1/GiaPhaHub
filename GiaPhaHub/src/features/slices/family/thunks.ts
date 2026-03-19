import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  FamilyMemberRequest,
  FamilyMemberResponse,
} from "@/models/FamilyMember";
import { FamilyService } from "@/services/familyService";

export const fetchMembers = createAsyncThunk<FamilyMemberResponse[]>(
  "family/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const res = await FamilyService.getAll();
      return res.data.items;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);
export const fetchDetailMember = createAsyncThunk<FamilyMemberResponse, number>(
  "family/fetchOne",
  async (id, { rejectWithValue }) => {
    try {
      const res = await FamilyService.getOne(id);
      return res.data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);

export const createMember = createAsyncThunk<
  FamilyMemberResponse,
  Omit<FamilyMemberRequest, "id">
>("family/create", async (data, { rejectWithValue }) => {
  try {
    const res = await FamilyService.create(data);
    return res.data;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const editMember = createAsyncThunk<
  FamilyMemberResponse,
  { id: number; payload: Omit<FamilyMemberRequest, "id"> }
>("family/edit", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const res = await FamilyService.update(id, payload);
    return res.data;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const removeMember = createAsyncThunk<number, number>(
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

export const fetchTree = createAsyncThunk<FamilyMemberResponse, number>(
  "family/fetchTree",
  async (rootId, { rejectWithValue }) => {
    try {
      const res = await FamilyService.getTree(rootId);
      return res.data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  },
);
