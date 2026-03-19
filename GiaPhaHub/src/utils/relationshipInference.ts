import type { FamilyMemberResponse } from "@/models/FamilyMember";
import type { RelationshipResponse } from "@/models/Relationship";

export type CanonicalRelationship = "parent" | "child" | "sibling" | "spouse";

export interface RelationshipEdge {
  to: number;
  type: CanonicalRelationship;
}

export type RelationshipGraph = Map<number, RelationshipEdge[]>;

export interface BfsResult {
  memberPath: number[];
  relationshipPath: CanonicalRelationship[];
}

export interface PathAnalysis {
  upCount: number;
  downCount: number;
  hasSibling: boolean;
  hasSpouse: boolean;
}

export type InferredBaseRelation =
  | "self"
  | "parent"
  | "grandparent"
  | "child"
  | "grandchild"
  | "uncle_aunt"
  | "sibling"
  | "spouse"
  | "relative"
  | "unrelated";

export interface InferredRelationship {
  base: InferredBaseRelation;
  label: string;
  isBloodRelated: boolean;
}

export interface RelationshipInferenceResult {
  sourceId: number;
  targetId: number;
  relationshipPath: CanonicalRelationship[];
  memberPath: number[];
  analysis: PathAnalysis;
  sourceToTarget: InferredRelationship;
  targetToSource: InferredRelationship;
  humanReadable: string;
  reverseHumanReadable: string;
}

const normalizeTypeName = (
  relationshipTypeName: string | null | undefined,
): string => (relationshipTypeName ?? "").trim().toLowerCase();

const isMale = (gender: string | null | undefined): boolean => {
  const normalized = (gender ?? "").trim().toLowerCase();
  return ["male", "m", "man", "nam"].includes(normalized);
};

const isFemale = (gender: string | null | undefined): boolean => {
  const normalized = (gender ?? "").trim().toLowerCase();
  return ["female", "f", "woman", "nu", "nữ"].includes(normalized);
};

const toVietnameseLowercase = (value: string): string =>
  value.toLocaleLowerCase("vi-VN");

const isAllSteps = (
  relationshipPath: CanonicalRelationship[],
  step: CanonicalRelationship,
): boolean =>
  relationshipPath.length > 0 &&
  relationshipPath.every((item) => item === step);

const getByPathIndex = (
  memberPath: number[],
  memberMap: Map<number, FamilyMemberResponse>,
  index: number,
): FamilyMemberResponse | undefined => {
  const memberId = memberPath[index];
  if (!memberId) return undefined;
  return memberMap.get(memberId);
};

const getParentLabel = (gender: string | null | undefined): string => {
  if (isMale(gender)) return "cha";
  if (isFemale(gender)) return "mẹ";
  return "cha/mẹ";
};

const getChildLabel = (gender: string | null | undefined): string => {
  if (isMale(gender)) return "con trai";
  if (isFemale(gender)) return "con gái";
  return "con";
};

const getSiblingLabel = (gender: string | null | undefined): string => {
  if (isMale(gender)) return "anh/em trai";
  if (isFemale(gender)) return "chị/em gái";
  return "anh/chị/em";
};

const getSpouseLabel = (gender: string | null | undefined): string => {
  if (isMale(gender)) return "chồng";
  if (isFemale(gender)) return "vợ";
  return "vợ/chồng";
};

const getGrandparentLabel = (
  targetGender: string | null | undefined,
  sourceParentGender: string | null | undefined,
): string => {
  if (isMale(targetGender)) {
    if (isMale(sourceParentGender)) return "ông nội";
    if (isFemale(sourceParentGender)) return "ông ngoại";
    return "ông";
  }

  if (isFemale(targetGender)) {
    if (isMale(sourceParentGender)) return "bà nội";
    if (isFemale(sourceParentGender)) return "bà ngoại";
    return "bà";
  }

  if (isMale(sourceParentGender)) return "ông/bà nội";
  if (isFemale(sourceParentGender)) return "ông/bà ngoại";
  return "ông/bà";
};

const getGrandchildLabel = (
  sourceChildGender: string | null | undefined,
  targetGender: string | null | undefined,
): string => {
  const side = isMale(sourceChildGender)
    ? "nội"
    : isFemale(sourceChildGender)
      ? "ngoại"
      : "";

  if (isMale(targetGender)) {
    return side ? `cháu trai ${side}` : "cháu trai";
  }

  if (isFemale(targetGender)) {
    return side ? `cháu gái ${side}` : "cháu gái";
  }

  return side ? `cháu ${side}` : "cháu";
};

const getTimeValue = (dateValue: string | null | undefined): number | null => {
  if (!dateValue) return null;
  const timestamp = new Date(dateValue).getTime();
  return Number.isNaN(timestamp) ? null : timestamp;
};

const isOlderThan = (
  memberBirthDate: string | null | undefined,
  referenceBirthDate: string | null | undefined,
): boolean | null => {
  const memberTime = getTimeValue(memberBirthDate);
  const referenceTime = getTimeValue(referenceBirthDate);

  if (memberTime === null || referenceTime === null) {
    return null;
  }

  return memberTime < referenceTime;
};

const getUncleAuntLabel = (
  target: FamilyMemberResponse | undefined,
  sourceParent: FamilyMemberResponse | undefined,
): string => {
  const targetGender = target?.gender;
  const sourceParentGender = sourceParent?.gender;

  if (isMale(sourceParentGender)) {
    if (isMale(targetGender)) {
      const older = isOlderThan(target?.birthDate, sourceParent?.birthDate);
      if (older === true) return "bác";
      if (older === false) return "chú";
      return "chú/bác";
    }
    if (isFemale(targetGender)) return "cô";
    return "cô/chú/bác";
  }

  if (isFemale(sourceParentGender)) {
    if (isMale(targetGender)) return "cậu";
    if (isFemale(targetGender)) return "dì";
    return "cậu/dì";
  }

  if (isMale(targetGender)) return "chú/bác/cậu";
  if (isFemale(targetGender)) return "cô/dì";
  return "cô/chú/bác/dì/cậu";
};

const getInLawParentLabel = (
  targetGender: string | null | undefined,
  spouseGender: string | null | undefined,
): string => {
  if (isMale(targetGender)) {
    if (isMale(spouseGender)) return "bố chồng";
    if (isFemale(spouseGender)) return "bố vợ";
    return "bố vợ/chồng";
  }

  if (isFemale(targetGender)) {
    if (isMale(spouseGender)) return "mẹ chồng";
    if (isFemale(spouseGender)) return "mẹ vợ";
    return "mẹ vợ/chồng";
  }

  if (isMale(spouseGender)) return "bố/mẹ chồng";
  if (isFemale(spouseGender)) return "bố/mẹ vợ";
  return "bố/mẹ vợ/chồng";
};

const getSpouseSiblingLabel = (
  spouseGender: string | null | undefined,
  targetGender: string | null | undefined,
): string => {
  const spouseSide = isMale(spouseGender)
    ? "chồng"
    : isFemale(spouseGender)
      ? "vợ"
      : "vợ/chồng";

  if (isMale(targetGender)) return `anh/em ${spouseSide}`;
  if (isFemale(targetGender)) return `chị/em ${spouseSide}`;
  return `anh/chị/em ${spouseSide}`;
};

const getSiblingSpouseLabel = (
  targetGender: string | null | undefined,
): string => {
  if (isMale(targetGender)) return "anh/chị/em rể";
  if (isFemale(targetGender)) return "chị/em dâu";
  return "dâu/rể";
};

const getStepParentLabel = (
  targetGender: string | null | undefined,
): string => {
  if (isMale(targetGender)) return "cha dượng";
  if (isFemale(targetGender)) return "mẹ kế";
  return "cha/mẹ kế";
};

const inferBaseFromPath = (
  relationshipPath: CanonicalRelationship[],
  analysis: PathAnalysis,
): InferredBaseRelation => {
  if (relationshipPath.length === 0) return "self";

  const pattern = relationshipPath.join(">");
  if (pattern === "spouse") return "spouse";
  if (pattern === "parent") return "parent";
  if (pattern === "child") return "child";
  if (pattern === "parent>parent") return "grandparent";
  if (pattern === "child>child") return "grandchild";
  if (pattern === "sibling") return "sibling";
  if (pattern === "parent>child") return "sibling";

  if (pattern === "parent>sibling" || pattern === "parent>parent>child") {
    return "uncle_aunt";
  }

  if (analysis.hasSpouse) {
    return "relative";
  }

  if (isAllSteps(relationshipPath, "parent")) {
    return "grandparent";
  }

  if (isAllSteps(relationshipPath, "child")) {
    return "grandchild";
  }

  return "relative";
};

const inferVietnameseLabel = (
  relationshipPath: CanonicalRelationship[],
  memberPath: number[],
  memberMap: Map<number, FamilyMemberResponse>,
): { label: string; isBloodRelated: boolean } => {
  const target = getByPathIndex(memberPath, memberMap, memberPath.length - 1);
  const firstHop = getByPathIndex(memberPath, memberMap, 1);
  const pattern = relationshipPath.join(">");

  if (relationshipPath.length === 0) {
    return { label: "chính mình", isBloodRelated: true };
  }

  if (pattern === "spouse") {
    return { label: getSpouseLabel(target?.gender), isBloodRelated: false };
  }

  if (pattern === "parent") {
    return { label: getParentLabel(target?.gender), isBloodRelated: true };
  }

  if (pattern === "child") {
    return { label: getChildLabel(target?.gender), isBloodRelated: true };
  }

  if (pattern === "sibling") {
    return { label: getSiblingLabel(target?.gender), isBloodRelated: true };
  }

  if (pattern === "parent>child") {
    return { label: getSiblingLabel(target?.gender), isBloodRelated: true };
  }

  if (pattern === "parent>parent") {
    return {
      label: getGrandparentLabel(target?.gender, firstHop?.gender),
      isBloodRelated: true,
    };
  }

  if (pattern === "child>child") {
    return {
      label: getGrandchildLabel(firstHop?.gender, target?.gender),
      isBloodRelated: true,
    };
  }

  if (pattern === "parent>sibling" || pattern === "parent>parent>child") {
    return {
      label: getUncleAuntLabel(target, firstHop),
      isBloodRelated: true,
    };
  }

  if (pattern === "sibling>child") {
    return {
      label: getGrandchildLabel(undefined, target?.gender),
      isBloodRelated: true,
    };
  }

  if (pattern === "parent>child>child") {
    return {
      label: getGrandchildLabel(undefined, target?.gender),
      isBloodRelated: true,
    };
  }

  if (
    pattern === "parent>sibling>child" ||
    pattern === "parent>parent>child>child"
  ) {
    return { label: "anh/chị/em họ", isBloodRelated: true };
  }

  if (pattern === "spouse>parent") {
    return {
      label: getInLawParentLabel(target?.gender, firstHop?.gender),
      isBloodRelated: false,
    };
  }

  if (pattern === "child>spouse") {
    if (isMale(target?.gender))
      return { label: "con rể", isBloodRelated: false };
    if (isFemale(target?.gender))
      return { label: "con dâu", isBloodRelated: false };
    return { label: "con dâu/rể", isBloodRelated: false };
  }

  if (pattern === "spouse>sibling") {
    return {
      label: getSpouseSiblingLabel(firstHop?.gender, target?.gender),
      isBloodRelated: false,
    };
  }

  if (pattern === "spouse>parent>child") {
    return {
      label: getSpouseSiblingLabel(firstHop?.gender, target?.gender),
      isBloodRelated: false,
    };
  }

  if (pattern === "sibling>spouse") {
    return {
      label: getSiblingSpouseLabel(target?.gender),
      isBloodRelated: false,
    };
  }

  if (pattern === "parent>child>spouse") {
    return {
      label: getSiblingSpouseLabel(target?.gender),
      isBloodRelated: false,
    };
  }

  if (pattern === "parent>spouse") {
    return { label: getStepParentLabel(target?.gender), isBloodRelated: false };
  }

  if (pattern === "child>spouse>parent") {
    return { label: "thông gia", isBloodRelated: false };
  }

  if (pattern === "spouse>child") {
    return { label: "con riêng của vợ/chồng", isBloodRelated: false };
  }

  if (isAllSteps(relationshipPath, "parent")) {
    if (relationshipPath.length === 3) {
      if (isMale(target?.gender))
        return { label: "cụ ông", isBloodRelated: true };
      if (isFemale(target?.gender))
        return { label: "cụ bà", isBloodRelated: true };
      return { label: "cụ", isBloodRelated: true };
    }

    return {
      label: `tổ tiên cách ${relationshipPath.length - 1} đời`,
      isBloodRelated: true,
    };
  }

  if (isAllSteps(relationshipPath, "child")) {
    if (relationshipPath.length === 3) {
      return { label: "chắt", isBloodRelated: true };
    }

    if (relationshipPath.length === 4) {
      return { label: "chút", isBloodRelated: true };
    }

    return {
      label: `hậu duệ cách ${relationshipPath.length - 1} đời`,
      isBloodRelated: true,
    };
  }

  const hasSpouse = relationshipPath.includes("spouse");
  if (hasSpouse) {
    return { label: "thông gia", isBloodRelated: false };
  }

  return { label: "họ hàng", isBloodRelated: true };
};

const addEdge = (
  graph: RelationshipGraph,
  from: number,
  to: number,
  type: CanonicalRelationship,
): void => {
  const existing = graph.get(from);
  if (!existing) {
    graph.set(from, [{ to, type }]);
    return;
  }

  if (existing.some((edge) => edge.to === to && edge.type === type)) {
    return;
  }

  existing.push({ to, type });
};

export const buildRelationshipGraph = (
  relationships: RelationshipResponse[],
): RelationshipGraph => {
  const graph: RelationshipGraph = new Map();

  for (const relationship of relationships) {
    const type = normalizeTypeName(
      relationship.relationshipType?.name ?? relationship.relationshipTypeName,
    );
    const from = relationship.fromMemberId;
    const to = relationship.toMemberId;

    if (!from || !to) {
      continue;
    }

    if (type === "parent" || type === "father" || type === "mother") {
      addEdge(graph, from, to, "parent");
      addEdge(graph, to, from, "child");
      continue;
    }

    if (type === "sibling") {
      addEdge(graph, from, to, "sibling");
      addEdge(graph, to, from, "sibling");
      continue;
    }

    if (type === "spouse" || type === "spouce") {
      addEdge(graph, from, to, "spouse");
      addEdge(graph, to, from, "spouse");
    }
  }

  return graph;
};

export const findShortestRelationshipPath = (
  graph: RelationshipGraph,
  sourceId: number,
  targetId: number,
): BfsResult | null => {
  if (sourceId === targetId) {
    return {
      memberPath: [sourceId],
      relationshipPath: [],
    };
  }

  const queue: number[] = [sourceId];
  const visited = new Set<number>([sourceId]);
  const previous = new Map<
    number,
    { from: number; relation: CanonicalRelationship }
  >();

  while (queue.length > 0) {
    const current = queue.shift();
    if (current === undefined) {
      continue;
    }

    const neighbors = graph.get(current) ?? [];

    for (const edge of neighbors) {
      if (visited.has(edge.to)) {
        continue;
      }

      visited.add(edge.to);
      previous.set(edge.to, { from: current, relation: edge.type });

      if (edge.to === targetId) {
        const relationshipPath: CanonicalRelationship[] = [];
        const memberPath: number[] = [targetId];

        let walker = targetId;
        while (walker !== sourceId) {
          const prev = previous.get(walker);
          if (!prev) {
            return null;
          }

          relationshipPath.push(prev.relation);
          memberPath.push(prev.from);
          walker = prev.from;
        }

        relationshipPath.reverse();
        memberPath.reverse();

        return { relationshipPath, memberPath };
      }

      queue.push(edge.to);
    }
  }

  return null;
};

export const analyzeRelationshipPath = (
  relationshipPath: CanonicalRelationship[],
): PathAnalysis => {
  return {
    upCount: relationshipPath.filter((step) => step === "parent").length,
    downCount: relationshipPath.filter((step) => step === "child").length,
    hasSibling: relationshipPath.includes("sibling"),
    hasSpouse: relationshipPath.includes("spouse"),
  };
};

const reversePath = (
  relationshipPath: CanonicalRelationship[],
): CanonicalRelationship[] => {
  return relationshipPath
    .slice()
    .reverse()
    .map((step) => {
      if (step === "parent") return "child";
      if (step === "child") return "parent";
      return step;
    });
};

export const inferRelationship = (
  members: FamilyMemberResponse[],
  relationships: RelationshipResponse[],
  sourceId: number,
  targetId: number,
): RelationshipInferenceResult | null => {
  const memberMap = new Map(members.map((member) => [member.id, member]));
  const source = memberMap.get(sourceId);
  const target = memberMap.get(targetId);

  if (!source || !target) {
    return null;
  }

  const graph = buildRelationshipGraph(relationships);
  const bfsResult = findShortestRelationshipPath(graph, sourceId, targetId);

  if (!bfsResult) {
    return {
      sourceId,
      targetId,
      relationshipPath: [],
      memberPath: [sourceId],
      analysis: {
        upCount: 0,
        downCount: 0,
        hasSibling: false,
        hasSpouse: false,
      },
      sourceToTarget: {
        base: "unrelated",
        label: "không có quan hệ",
        isBloodRelated: false,
      },
      targetToSource: {
        base: "unrelated",
        label: "không có quan hệ",
        isBloodRelated: false,
      },
      humanReadable: `${source.name} không có quan hệ trực tiếp với ${target.name}`,
      reverseHumanReadable: `${target.name} không có quan hệ trực tiếp với ${source.name}`,
    };
  }

  const targetRoleFromSourcePerspective = analyzeRelationshipPath(
    bfsResult.relationshipPath,
  );
  const targetRelativeToSource = inferVietnameseLabel(
    bfsResult.relationshipPath,
    bfsResult.memberPath,
    memberMap,
  );
  const targetBase = inferBaseFromPath(
    bfsResult.relationshipPath,
    targetRoleFromSourcePerspective,
  );

  const sourcePath = reversePath(bfsResult.relationshipPath);
  const sourceMemberPath = bfsResult.memberPath.slice().reverse();
  const sourceRoleFromTargetPerspective = analyzeRelationshipPath(sourcePath);
  const sourceRelativeToTarget = inferVietnameseLabel(
    sourcePath,
    sourceMemberPath,
    memberMap,
  );
  const sourceBase = inferBaseFromPath(
    sourcePath,
    sourceRoleFromTargetPerspective,
  );

  return {
    sourceId,
    targetId,
    relationshipPath: bfsResult.relationshipPath,
    memberPath: bfsResult.memberPath,
    analysis: targetRoleFromSourcePerspective,
    sourceToTarget: {
      base: sourceBase,
      label: sourceRelativeToTarget.label,
      isBloodRelated: sourceRelativeToTarget.isBloodRelated,
    },
    targetToSource: {
      base: targetBase,
      label: targetRelativeToSource.label,
      isBloodRelated: targetRelativeToSource.isBloodRelated,
    },
    humanReadable: `${source.name} là ${toVietnameseLowercase(sourceRelativeToTarget.label)} của ${target.name}`,
    reverseHumanReadable: `${target.name} là ${toVietnameseLowercase(targetRelativeToSource.label)} của ${source.name}`,
  };
};
