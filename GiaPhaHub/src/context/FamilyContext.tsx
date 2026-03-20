import { useEffect, type ReactNode } from "react";
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

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  // ── CRUD (async thunks) ─────────────────────────────────
  const loadMembers = () => dispatch(fetchMembers());

  const addMember = (member: Omit<FamilyMemberRequest, "id">) =>
    dispatch(createMember(member));

  const updateMember = (member: {
    id: number;
    payload: Omit<FamilyMemberRequest, "id">;
  }) => dispatch(editMember(member));

  const deleteMember = (id: number) => dispatch(removeMember(id));

  // ── Query helpers ────────────────────────────────────────
  const getMember = (id: number) => members.find((m) => m.id === id);

  const getChildren = (parentId: number) =>
    members.filter((m) => getParentId(m) === parentId);

  const getSpouse = (memberId: number) => {
    const member = getMember(memberId);
    const spouseId = getSpouseId(member);
    if (spouseId) return getMember(spouseId);
    return members.find((m) => getSpouseId(m) === memberId);
  };

  const getParent = (memberId: number) => {
    const member = getMember(memberId);
    const parentId = getParentId(member);
    if (parentId) return getMember(parentId);
    return undefined;
  };

  const getRootMembers = () =>
    members.filter((m) => !getParentId(m) && !getSpouseId(m));

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

