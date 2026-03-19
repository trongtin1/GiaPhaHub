import type { RelationshipResponse } from "@/models/Relationship";

export interface FamilyMemberResponse {
  id: number;
  name: string;
  gender: string;
  birthDate: string;
  deathDate: string;
  avatar: string | null;
  phone: string | null;
  address: string | null;
  bio: string | null;
  generation: number;
  fatherId: number | null;
  motherId: number | null;
  children: number[];
  spouses: number[];
  members: Record<number, FamilyMemberResponse> | FamilyMemberResponse[];
  fromRelationships?: RelationshipResponse[];
  toRelationships?: RelationshipResponse[];
}
export interface FamilyMemberRequest {
  name: string;
  gender: string;
  birthDate: string;
  deathDate: string;
  avatar: string;
  phone: string;
  address: string;
  bio: string;
  parentId: number;
  spouseId: number;
  spouseRelationship: string;
  generation: number;
}
