import { createSlice } from "@reduxjs/toolkit";
import type {
  KinshipInferenceResponse,
  RelationshipResponse,
  RelationshipTypeResponse,
} from "@/models/Relationship";
import {
  createRelationship,
  editRelationship,
  fetchRelationships,
  fetchRelationshipsByMemberId,
  fetchRelationshipTypes,
  inferKinship,
  removeRelationship,
} from "./thunks";

interface RelationshipState {
  data: RelationshipResponse[];
  types: RelationshipTypeResponse[];
  loading: boolean;
  loadingTypes: boolean;
  error: string | null;
  typeError: string | null;
  kinship: KinshipInferenceResponse | null;
  kinshipLoading: boolean;
  kinshipError: string | null;
}

const initialState: RelationshipState = {
  data: [],
  types: [],
  loading: false,
  loadingTypes: false,
  error: null,
  typeError: null,
  kinship: null,
  kinshipLoading: false,
  kinshipError: null,
};

const relationshipSlice = createSlice({
  name: "relationship",
  initialState,
  reducers: {
    clearKinshipResult: (state) => {
      state.kinship = null;
      state.kinshipError = null;
      state.kinshipLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRelationships.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelationships.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchRelationships.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRelationshipsByMemberId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRelationshipsByMemberId.fulfilled, (state, action) => {
        state.data = action.payload;
        state.loading = false;
      })
      .addCase(fetchRelationshipsByMemberId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createRelationship.fulfilled, (state, action) => {
        state.data.push(action.payload);
      })
      .addCase(editRelationship.fulfilled, (state, action) => {
        const idx = state.data.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (idx !== -1) {
          state.data[idx] = action.payload;
        }
      })
      .addCase(removeRelationship.fulfilled, (state, action) => {
        state.data = state.data.filter((item) => item.id !== action.payload);
      })
      .addCase(fetchRelationshipTypes.pending, (state) => {
        state.loadingTypes = true;
        state.typeError = null;
      })
      .addCase(fetchRelationshipTypes.fulfilled, (state, action) => {
        state.types = action.payload;
        state.loadingTypes = false;
      })
      .addCase(fetchRelationshipTypes.rejected, (state, action) => {
        state.loadingTypes = false;
        state.typeError = action.payload as string;
      })
      .addCase(inferKinship.pending, (state) => {
        state.kinshipLoading = true;
        state.kinshipError = null;
      })
      .addCase(inferKinship.fulfilled, (state, action) => {
        state.kinship = action.payload;
        state.kinshipLoading = false;
      })
      .addCase(inferKinship.rejected, (state, action) => {
        state.kinship = null;
        state.kinshipLoading = false;
        state.kinshipError = action.payload as string;
      });
  },
});

export const { clearKinshipResult } = relationshipSlice.actions;
export default relationshipSlice.reducer;
