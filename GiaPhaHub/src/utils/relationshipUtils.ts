import type { FamilyMemberResponse } from "@/models/FamilyMember";
import type { RelationshipResponse } from "@/models/Relationship";

const PARENT_KEYWORDS = ["parent", "cha", "mẹ", "bố", "má", "father", "mother"];
const SPOUSE_KEYWORDS = ["spouse", "spouce", "vợ", "chồng", "phu", "thê"];

export const getRelationName = (rel: {
  relationshipType?: { name?: string | null } | null;
  relationshipTypeName?: string | null;
}) =>
  (rel.relationshipType?.name ?? rel.relationshipTypeName ?? "")
    .trim()
    .toLowerCase();

export interface MemberRef {
  id: number;
  name: string;
}

const isParentRelationship = (relation: RelationshipResponse): boolean => {
  const name = getRelationName(relation);
  return ["parent", "father", "mother", "cha", "mẹ", "bố", "má"].some(
    (keyword) => name.includes(keyword),
  );
};

export const getChildrenRefsFromMember = (
  member: FamilyMemberResponse | undefined,
  getNameById?: (id: number) => string | undefined,
): MemberRef[] => {
  if (!member) return [];

  return (member.toRelationships ?? [])
    .filter(isParentRelationship)
    .map((relation) => ({
      id: relation.fromMemberId,
      name:
        relation.fromMemberName?.trim() ||
        getNameById?.(relation.fromMemberId) ||
        `Thành viên #${relation.fromMemberId}`,
    }));
};

export const mergeMemberRefs = (...groups: MemberRef[][]): MemberRef[] => {
  const map = new Map<number, MemberRef>();

  for (const group of groups) {
    for (const item of group) {
      if (!map.has(item.id)) {
        map.set(item.id, item);
      }
    }
  }

  return Array.from(map.values());
};

const findRelatedId = (
  relationships: RelationshipResponse[] | undefined,
  keywords: string[],
  pickId: (rel: RelationshipResponse) => number,
): number | undefined => {
  for (const rel of relationships ?? []) {
    const relationName = getRelationName(rel);
    if (keywords.some((k) => relationName.includes(k))) {
      return pickId(rel);
    }
  }
  return undefined;
};

export const getParentId = (
  member: FamilyMemberResponse | undefined,
): number | undefined => {
  if (!member) return undefined;

  return (
    member.fatherId ??
    member.motherId ??
    findRelatedId(
      member.fromRelationships,
      PARENT_KEYWORDS,
      (rel) => rel.toMemberId,
    )
  );
};

export const getSpouseId = (
  member: FamilyMemberResponse | undefined,
): number | undefined => {
  if (!member) return undefined;

  return (
    member.spouses?.[0] ??
    findRelatedId(
      member.fromRelationships,
      SPOUSE_KEYWORDS,
      (rel) => rel.toMemberId,
    ) ??
    findRelatedId(
      member.toRelationships,
      SPOUSE_KEYWORDS,
      (rel) => rel.fromMemberId,
    )
  );
};
