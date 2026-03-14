import type { FamilyMemberResponse } from "@/models/FamilyMember";

const PARENT_KEYWORDS = ["cha", "mẹ", "bố", "má", "father", "mother", "parent"];
const SPOUSE_KEYWORDS = ["vợ", "chồng", "spouse", "phu", "thê"];

export const getParentId = (member: FamilyMemberResponse | undefined): number | undefined => {
  if (!member || !member.relationships) return undefined;
  for (const rel of member.relationships) {
    const relStr = rel.relationship.toLowerCase();
    if (PARENT_KEYWORDS.some((k) => relStr.includes(k))) {
      return rel.memberId;
    }
  }
  return undefined;
};

export const getSpouseId = (member: FamilyMemberResponse | undefined): number | undefined => {
  if (!member || !member.relationships) return undefined;
  for (const rel of member.relationships) {
    const relStr = rel.relationship.toLowerCase();
    if (SPOUSE_KEYWORDS.some((k) => relStr.includes(k))) {
      return rel.memberId;
    }
  }
  return undefined;
};
