import { createSlice } from "@reduxjs/toolkit";
import type { AsyncStatus } from "@/types";
import type { FamilyMemberResponse } from "@/models/FamilyMember";
import {
  createMember,
  editMember,
  fetchDetailMember,
  fetchMembers,
  removeMember,
} from "./thunks";

interface FamilyState {
  data: FamilyMemberResponse[];
  status: Record<string, AsyncStatus>;
}

const initialState: FamilyState = {
  data: [],
  status: {},
};

const familySlice = createSlice({
  name: "family",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMembers.pending, (state) => {
        state.status.fetchMembers = { loading: true, error: null };
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.data = action.payload;
        state.status.fetchMembers = { loading: false, error: null };
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.status.fetchMembers = {
          loading: false,
          error: action.payload as string,
        };
      })

      .addCase(fetchDetailMember.pending, (state) => {
        state.status.fetchDetailMember = { loading: true, error: null };
      })
      .addCase(fetchDetailMember.fulfilled, (state, action) => {
        const idx = state.data.findIndex((m) => m.id === action.payload.id);
        if (idx !== -1) {
          state.data[idx] = action.payload;
        } else {
          state.data.push(action.payload);
        }
        state.status.fetchDetailMember = { loading: false, error: null };
      })
      .addCase(fetchDetailMember.rejected, (state, action) => {
        state.status.fetchDetailMember = {
          loading: false,
          error: action.payload as string,
        };
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
