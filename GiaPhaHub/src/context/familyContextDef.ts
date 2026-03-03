import { createContext } from "react";
import type { FamilyMember } from "../types";

export interface FamilyContextType {
  members: FamilyMember[];
  addMember: (member: Omit<FamilyMember, "id">) => void;
  updateMember: (member: FamilyMember) => void;
  deleteMember: (id: string) => void;
  getMember: (id: string) => FamilyMember | undefined;
  getChildren: (parentId: string) => FamilyMember[];
  getSpouse: (memberId: string) => FamilyMember | undefined;
  getParent: (memberId: string) => FamilyMember | undefined;
  getRootMembers: () => FamilyMember[];
}

export const FamilyContext = createContext<FamilyContextType | null>(null);
