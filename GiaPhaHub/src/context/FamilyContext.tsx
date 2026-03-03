/**
 * FamilyContext.tsx
 *
 * Provider mỏng — chỉ đọc state từ Redux và cung cấp
 * các helper function tiện dụng qua context cho toàn app.
 *
 * Tại sao vẫn giữ Context?
 * → Các helper như getMember(), getChildren() dùng nhiều ở component.
 *   Đặt chúng ở đây tránh viết lại logic tại mỗi component.
 *
 * Khi nối BE: chỉ cần thay dispatch(syncAction) → dispatch(asyncThunk)
 * mà không cần sửa bất kỳ component nào.
 */

import { type ReactNode } from "react";
import type { FamilyMember } from "@/types";
import { FamilyContext } from "./familyContextDef";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addMember as addMemberAction,
  updateMember as updateMemberAction,
  deleteMember as deleteMemberAction,
  selectAllMembers,
} from "@/store/familySlice";

export function FamilyProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const members = useAppSelector(selectAllMembers);

  // ── CRUD ────────────────────────────────────────────────
  // Khi có BE: đổi thành dispatch(createMember(member)) từ familyThunks
  const addMember = (member: Omit<FamilyMember, "id">) =>
    dispatch(addMemberAction(member));

  const updateMember = (member: FamilyMember) =>
    dispatch(updateMemberAction(member));

  const deleteMember = (id: string) => dispatch(deleteMemberAction(id));

  // ── Query helpers ────────────────────────────────────────
  const getMember = (id: string) => members.find((m) => m.id === id);

  const getChildren = (parentId: string) =>
    members.filter((m) => m.parentId === parentId);

  const getSpouse = (memberId: string) => {
    const member = getMember(memberId);
    if (member?.spouseId) return getMember(member.spouseId);
    return members.find((m) => m.spouseId === memberId);
  };

  const getParent = (memberId: string) => {
    const member = getMember(memberId);
    if (member?.parentId) return getMember(member.parentId);
    return undefined;
  };

  const getRootMembers = () =>
    members.filter((m) => !m.parentId && !m.spouseId);

  return (
    <FamilyContext.Provider
      value={{
        members,
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
