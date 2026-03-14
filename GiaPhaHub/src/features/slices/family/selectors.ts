import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "@/features";
import { getParentId, getSpouseId } from "@/utils/relationshipUtils";

export const selectAllMembers = (state: RootState) => state.family.data;
export const selectFamilyLoading = (state: RootState) => state.family.loading;
export const selectFamilyError = (state: RootState) => state.family.error;

export const selectMemberById = createSelector(
  [selectAllMembers, (_: RootState, id: number) => id],
  (members, id) => members.find((m) => m.id === id),
);

export const selectChildren = createSelector(
  [selectAllMembers, (_: RootState, parentId: number) => parentId],
  (members, parentId) => members.filter((m) => getParentId(m) === parentId),
);

export const selectSpouse = createSelector(
  [selectAllMembers, (_: RootState, memberId: number) => memberId],
  (members, memberId) => {
    const member = members.find((m) => m.id === memberId);
    const spouseId = getSpouseId(member);
    if (spouseId) return members.find((m) => m.id === spouseId);
    return members.find((m) => getSpouseId(m) === memberId);
  },
);

export const selectParent = createSelector(
  [selectAllMembers, (_: RootState, memberId: number) => memberId],
  (members, memberId) => {
    const member = members.find((m) => m.id === memberId);
    const parentId = getParentId(member);
    if (parentId) return members.find((m) => m.id === parentId);
    return undefined;
  },
);

export const selectRootMembers = createSelector([selectAllMembers], (members) =>
  members.filter((m) => !getParentId(m) && !getSpouseId(m)),
);

