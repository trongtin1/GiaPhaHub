import { useCallback, type ReactNode } from "react";
import type { FamilyMemberRequest } from "@/models/FamilyMember";
import { FamilyContext } from "./familyContextDef";
import { useAppDispatch, useAppSelector } from "@/features";
import { getParentId, getSpouseId } from "@/utils/relationshipUtils";
import {
  fetchMembers,
  createMember,
  editMember,
  removeMember,
} from "@/features/slices/family/thunks";
import { selectFamilyResource } from "@/features/slices/family/selectors";

export function FamilyProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const { data: members, loading, error } = useAppSelector(selectFamilyResource);
  // const accessToken = useAppSelector((state) => state.auth.accessToken);


  // ── CRUD (async thunks) ─────────────────────────────────
  const loadMembers = useCallback(() => dispatch(fetchMembers()), [dispatch]);

  const addMember = useCallback((member: Omit<FamilyMemberRequest, "id">) =>
    dispatch(createMember(member)), [dispatch]);

  const updateMember = useCallback((member: {
    id: number;
    payload: Omit<FamilyMemberRequest, "id">;
  }) => dispatch(editMember(member)), [dispatch]);

  const deleteMember = useCallback((id: number) => dispatch(removeMember(id)), [dispatch]);

  // ── Query helpers ────────────────────────────────────────
  const getMember = useCallback((id: number) => members.find((m) => m.id === id), [members]);

  const getChildren = useCallback((parentId: number) =>
    members.filter((m) => getParentId(m) === parentId), [members]);

  const getSpouse = useCallback((memberId: number) => {
    const member = getMember(memberId);
    if (!member) return undefined;
    const spouseId = getSpouseId(member);
    if (spouseId) return getMember(spouseId);
    return members.find((m) => getSpouseId(m) === memberId);
  }, [members, getMember]);

  const getParent = useCallback((memberId: number) => {
    const member = getMember(memberId);
    if (!member) return undefined;
    const parentId = getParentId(member);
    if (parentId) return getMember(parentId);
    return undefined;
  }, [getMember]);

  const getRootMembers = useCallback(() =>
    members.filter((m) => !getParentId(m) && !getSpouseId(m)), [members]);

  return (
    <FamilyContext.Provider
      value={{
        members,
        loading,
        error,
        loadMembers,
        addMember,
        updateMember,
        deleteMember,
        getMember,
        getChildren,
        getSpouse,
        getParent,
        getRootMembers,
      }}
    >
      {children}
    </FamilyContext.Provider>
  );
}

