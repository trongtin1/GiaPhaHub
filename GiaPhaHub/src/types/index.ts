export type Gender = "male" | "female";

export interface FamilyTree {
  id: number;
  name: string;
  description?: string;
  createDate: string;
  modifiedDate: string;
}

export interface Relationship {
  id: number;
  fromMemberId: number;
  toMemberId: number;
  relationshipTypeId: number;
  fromMemberName?: string;
  toMemberName?: string;
  relationshipType?: RelationshipType;
  relationshipTypeName?: string;
}

export interface RelationshipType {
  id: number;
  name: string;
  description?: string;
}

export interface ResourceState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}
