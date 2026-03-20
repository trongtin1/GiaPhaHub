import { createSlice } from "@reduxjs/toolkit";
import type {
  KinshipInferenceResponse,
  RelationshipResponse,
  RelationshipTypeResponse,
} from "@/models/Relationship";
import type { AsyncStatus } from "@/types";
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
  relationships: RelationshipResponse[];
  relationshipTypes: RelationshipTypeResponse[];
  kinship: KinshipInferenceResponse | null;
  status: Record<string, AsyncStatus>;
}

const initialState: RelationshipState = {
  relationships: [],
  relationshipTypes: [],
  kinship: null,
  status: {},
};

const relationshipSlice = createSlice({
  name: "relationship",
  initialState,
  reducers: {
    clearKinshipResult: (state) => {
      state.kinship = null;
      state.status.inferKinship = { loading: false, error: null };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRelationships.pending, (state) => {
        state.status.fetchRelationships = { loading: true, error: null };
      })
      .addCase(fetchRelationships.fulfilled, (state, action) => {
        state.relationships = action.payload;
        state.status.fetchRelationships = { loading: false, error: null };
      })
      .addCase(fetchRelationships.rejected, (state, action) => {
        state.status.fetchRelationships = {
          loading: false,
          error: action.payload as string,
        };
      })
      .addCase(fetchRelationshipsByMemberId.pending, (state) => {
        state.status.fetchRelationshipsByMemberId = {
          loading: true,
          error: null,
        };
      })
      .addCase(fetchRelationshipsByMemberId.fulfilled, (state, action) => {
        state.relationships = action.payload;
        state.status.fetchRelationshipsByMemberId = {
          loading: false,
          error: null,
        };
      })
      .addCase(fetchRelationshipsByMemberId.rejected, (state, action) => {
        state.status.fetchRelationshipsByMemberId = {
          loading: false,
          error: action.payload as string,
        };
      })
      .addCase(createRelationship.fulfilled, (state, action) => {
        state.relationships.push(action.payload);
      })
      .addCase(editRelationship.fulfilled, (state, action) => {
        const idx = state.relationships.findIndex(
          (item) => item.id === action.payload.id,
        );
        if (idx !== -1) {
          state.relationships[idx] = action.payload;
        }
      })
      .addCase(removeRelationship.fulfilled, (state, action) => {
        state.relationships = state.relationships.filter(
          (item) => item.id !== action.payload,
        );
      })
      .addCase(fetchRelationshipTypes.pending, (state) => {
        state.status.fetchRelationshipTypes = { loading: true, error: null };
      })
      .addCase(fetchRelationshipTypes.fulfilled, (state, action) => {
        state.relationshipTypes = action.payload;
        state.status.fetchRelationshipTypes = { loading: false, error: null };
      })
      .addCase(fetchRelationshipTypes.rejected, (state, action) => {
        state.status.fetchRelationshipTypes = {
          loading: false,
          error: action.payload as string,
        };
      })
      .addCase(inferKinship.pending, (state) => {
        state.status.inferKinship = { loading: true, error: null };
      })
      .addCase(inferKinship.fulfilled, (state, action) => {
        state.kinship = action.payload;
        state.status.inferKinship = { loading: false, error: null };
      })
      .addCase(inferKinship.rejected, (state, action) => {
        state.kinship = null;
        state.status.inferKinship = {
          loading: false,
          error: action.payload as string,
        };
      });
  },
});

export const { clearKinshipResult } = relationshipSlice.actions;
export default relationshipSlice.reducer;
