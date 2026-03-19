import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/features";

export const selectRelationships = (state: RootState) =>
  state.relationship.data;
export const selectRelationshipTypes = (state: RootState) =>
  state.relationship.types;
export const selectRelationshipLoading = (state: RootState) =>
  state.relationship.loading;
export const selectRelationshipError = (state: RootState) =>
  state.relationship.error;
export const selectRelationshipTypeLoading = (state: RootState) =>
  state.relationship.loadingTypes;
export const selectRelationshipTypeError = (state: RootState) =>
  state.relationship.typeError;
export const selectKinshipResult = (state: RootState) =>
  state.relationship.kinship;
export const selectKinshipLoading = (state: RootState) =>
  state.relationship.kinshipLoading;
export const selectKinshipError = (state: RootState) =>
  state.relationship.kinshipError;

export const selectRelationshipById = createSelector(
  [
    selectRelationships,
    (_: RootState, relationshipId: number) => relationshipId,
  ],
  (relationships, relationshipId) =>
    relationships.find((relationship) => relationship.id === relationshipId),
);

export const selectRelationshipsByMemberId = createSelector(
  [selectRelationships, (_: RootState, memberId: number) => memberId],
  (relationships, memberId) =>
    relationships.filter(
      (relationship) =>
        relationship.fromMemberId === memberId ||
        relationship.toMemberId === memberId,
    ),
);
