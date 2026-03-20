import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/features";

export const selectRelationships = (state: RootState) =>
  state.relationship.relationships;
export const selectRelationshipTypes = (state: RootState) =>
  state.relationship.relationshipTypes;

export const selectRelationshipResource = createSelector(
  [
    selectRelationships,
    (state: RootState) => state.relationship.status.fetchRelationships,
  ],
  (data, status) => ({
    data,
    loading: status?.loading ?? false,
    error: status?.error ?? null,
  }),
);

export const selectRelationshipTypeResource = createSelector(
  [
    selectRelationshipTypes,
    (state: RootState) => state.relationship.status.fetchRelationshipTypes,
  ],
  (types, status) => ({
    types,
    loading: status?.loading ?? false,
    error: status?.error ?? null,
  }),
);

export const selectKinshipResource = createSelector(
  [
    (state: RootState) => state.relationship.kinship,
    (state: RootState) => state.relationship.status.inferKinship,
  ],
  (kinship, status) => ({
    kinship,
    loading: status?.loading ?? false,
    error: status?.error ?? null,
  }),
);

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
