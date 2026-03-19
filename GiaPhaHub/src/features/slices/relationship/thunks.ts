import { createAsyncThunk } from "@reduxjs/toolkit";
import type {
  KinshipInferenceRequest,
  KinshipInferenceResponse,
  RelationshipResponse,
  RelationshipTypeResponse,
  RelationshipRequest,
  RelationshipTypeRequest,
} from "@/models/Relationship";
import { RelationshipService } from "@/services/relationshipService";
import { RelationshipTypeService } from "@/services/relationshipTypeService";
export const fetchRelationships = createAsyncThunk<
  RelationshipResponse[],
  RelationshipRequest | undefined
>("relationship/fetchAll", async (query, { rejectWithValue }) => {
  try {
    const res = await RelationshipService.getAll(query);
    return res.data.items;
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || "Không tải được danh sách quan hệ");
  }
});

export const fetchRelationshipsByMemberId = createAsyncThunk<
  RelationshipResponse[],
  number
>("relationship/fetchByMemberId", async (memberId, { rejectWithValue }) => {
  try {
    const res = await RelationshipService.getByMemberId(memberId);
    return res.data;
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(
      error.message || "Không tải được quan hệ theo thành viên",
    );
  }
});

export const createRelationship = createAsyncThunk<
  RelationshipResponse,
  RelationshipRequest
>("relationship/create", async (payload, { rejectWithValue }) => {
  try {
    const res = await RelationshipService.create(payload);
    return res.data;
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || "Tạo quan hệ thất bại");
  }
});

export const editRelationship = createAsyncThunk<
  RelationshipResponse,
  { id: number; payload: RelationshipRequest }
>("relationship/edit", async ({ id, payload }, { rejectWithValue }) => {
  try {
    const res = await RelationshipService.update(id, payload);
    return res.data;
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || "Cập nhật quan hệ thất bại");
  }
});

export const removeRelationship = createAsyncThunk<number, number>(
  "relationship/remove",
  async (id, { rejectWithValue }) => {
    try {
      await RelationshipService.delete(id);
      return id;
    } catch (err: unknown) {
      const error = err as { message?: string };
      return rejectWithValue(error.message || "Xóa quan hệ thất bại");
    }
  },
);

export const fetchRelationshipTypes = createAsyncThunk<
  RelationshipTypeResponse[],
  RelationshipTypeRequest | undefined
>("relationship/fetchTypes", async (query, { rejectWithValue }) => {
  try {
    const res = await RelationshipTypeService.getAll(query);
    return res.data.items;
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || "Không tải được loại quan hệ");
  }
});

export const inferKinship = createAsyncThunk<
  KinshipInferenceResponse,
  KinshipInferenceRequest
>("relationship/inferKinship", async (payload, { rejectWithValue }) => {
  try {
    const res = await RelationshipService.inferKinship(payload);
    return res.data;
  } catch (err: unknown) {
    const error = err as { message?: string };
    return rejectWithValue(error.message || "Không suy luận được danh xưng");
  }
});
