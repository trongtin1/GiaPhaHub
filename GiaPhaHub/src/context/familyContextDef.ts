import { createContext } from "react";
import type { FamilyMemberResponse, FamilyMemberRequest } from "../models/FamilyMember";

export interface FamilyContextType {
  members: FamilyMemberResponse[];
  loading: boolean;
  error: string | null;
  loadMembers: () => void;
  addMember: (member: Omit<FamilyMemberRequest, "id">) => void;
  updateMember: (member: { id: number; payload: Omit<FamilyMemberRequest, "id"> }) => void;
  deleteMember: (id: number) => void;
  getMember: (id: number) => FamilyMemberResponse | undefined;
  getChildren: (parentId: number) => FamilyMemberResponse[];
  getSpouse: (memberId: number) => FamilyMemberResponse | undefined;
  getParent: (memberId: number) => FamilyMemberResponse | undefined;
  getRootMembers: () => FamilyMemberResponse[];
}

export const FamilyContext = createContext<FamilyContextType | null>(null);
