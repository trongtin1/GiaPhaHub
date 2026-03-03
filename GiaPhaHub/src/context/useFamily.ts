/**
 * useFamily.ts
 *
 * Hook tiện dụng để truy cập toàn bộ state & actions của family.
 * Dùng ở mọi component thay vì import useContext(FamilyContext) trực tiếp.
 *
 * Ví dụ:
 *   const { members, addMember, getMember } = useFamily();
 */

import { useContext } from "react";
import { FamilyContext } from "./familyContextDef";

export function useFamily() {
  const ctx = useContext(FamilyContext);
  if (!ctx) throw new Error("useFamily phải được dùng bên trong <FamilyProvider>");
  return ctx;
}
