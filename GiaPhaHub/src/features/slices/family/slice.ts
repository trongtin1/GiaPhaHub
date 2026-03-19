import { createSlice } from "@reduxjs/toolkit";
import type { ResourceState } from "@/types";
import type { FamilyMemberResponse } from "@/models/FamilyMember";
import {
  createMember,
  editMember,
  fetchDetailMember,
  fetchMembers,
  removeMember,
} from "./thunks";

type FamilyState = ResourceState<FamilyMemberResponse[]>;

const initialState: FamilyState = {
  data: [],
  loading: false,
  error: null,
};

const familySlice = createSlice({
  name: "family",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
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

      .addCase(fetchDetailMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDetailMember.fulfilled, (state, action) => {
        const idx = state.data.findIndex((m) => m.id === action.payload.id);
        if (idx !== -1) {
          state.data[idx] = action.payload;
        } else {
          state.data.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(fetchDetailMember.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })

      .addCase(createMember.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(editMember.fulfilled, (state, action) => {
        const idx = state.data.findIndex((m) => m.id === action.payload.id);
        if (idx !== -1) state.data[idx] = action.payload;
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        const id = action.payload;
        state.data = state.data.filter((m) => m.id !== id);
      });
  },
});

export default familySlice.reducer;
