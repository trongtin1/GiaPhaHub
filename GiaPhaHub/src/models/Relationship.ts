export interface RelationshipResponse {
  id: number;
  fromMemberId: number;
  toMemberId: number;
  relationshipTypeId: number;
  fromMemberName?: string | null;
  toMemberName?: string | null;
  relationshipType?: RelationshipTypeResponse | null;
  relationshipTypeName?: string | null;
}

export interface RelationshipRequest {
  fromMemberId: number;
  toMemberId: number;
  relationshipTypeId: number;
}

export interface RelationshipTypeResponse {
  id: number;
  name: string;
  description?: string | null;
}

export interface RelationshipTypeRequest {
  name: string;
  description?: string | null;
}

export interface KinshipInferenceRequest {
  sourceMemberId: number;
  targetMemberId: number;
}

export interface KinshipInferenceResponse {
  sourceId: number;
  targetId: number;
  sourceCallLabel: string;
  targetCallLabel: string;
  humanReadable: string;
  reverseHumanReadable: string;
  isBloodRelated: boolean;
}
