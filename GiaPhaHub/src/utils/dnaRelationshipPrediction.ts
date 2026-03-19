import type { FamilyMemberResponse } from "@/models/FamilyMember";
import type { RelationshipResponse } from "@/models/Relationship";
import { inferRelationship } from "@/utils/relationshipInference";

export interface DnaRelationshipPrediction {
  relationLabel: string;
  sourceCallLabel: string;
  targetCallLabel: string;
  estimatedSharedDnaPercent: number;
  confidence: "high" | "medium" | "low";
  explanation: string;
  isBloodRelated: boolean;
}

const round1 = (value: number) => Math.round(value * 10) / 10;

const capitalizeFirst = (value: string): string => {
  if (!value) return value;
  return value.charAt(0).toLocaleUpperCase("vi-VN") + value.slice(1);
};

const estimateDnaPercent = (
  relationBase: string,
  upCount: number,
  downCount: number,
  isBloodRelated: boolean,
): number => {
  if (!isBloodRelated) return 0;
  if (relationBase === "self") return 100;
  if (relationBase === "spouse" || relationBase === "unrelated") return 0;

  if (relationBase === "parent" || relationBase === "child") return 50;
  if (relationBase === "grandparent" || relationBase === "grandchild") {
    return 25;
  }
  if (relationBase === "sibling") return 50;
  if (relationBase === "uncle_aunt") return 25;

  const distance = upCount + downCount;
  if (distance <= 0) return 0;

  return round1(Math.min(100, 100 * Math.pow(0.5, distance)));
};

const relationshipStepLabel: Record<string, string> = {
  parent: "cha/mẹ",
  child: "con",
  sibling: "anh/chị/em",
  spouse: "vợ/chồng",
};

export const predictDnaRelationship = (
  members: FamilyMemberResponse[],
  relationships: RelationshipResponse[],
  sourceId: number,
  targetId: number,
): DnaRelationshipPrediction => {
  if (!members.length) {
    return {
      relationLabel: "Không xác định",
      sourceCallLabel: "Không xác định",
      targetCallLabel: "Không xác định",
      estimatedSharedDnaPercent: 0,
      confidence: "low",
      explanation: "Thiếu dữ liệu thành viên để phân tích quan hệ DNA.",
      isBloodRelated: false,
    };
  }

  const inference = inferRelationship(
    members,
    relationships,
    sourceId,
    targetId,
  );

  if (!inference) {
    return {
      relationLabel: "Không xác định",
      sourceCallLabel: "Không xác định",
      targetCallLabel: "Không xác định",
      estimatedSharedDnaPercent: 0,
      confidence: "low",
      explanation:
        "Thiếu dữ liệu quan hệ để suy luận giữa hai thành viên đã chọn.",
      isBloodRelated: false,
    };
  }

  if (inference.sourceToTarget.base === "unrelated") {
    return {
      relationLabel: "Không xác định",
      sourceCallLabel: "Không xác định",
      targetCallLabel: "Không xác định",
      estimatedSharedDnaPercent: 0,
      confidence: "low",
      explanation:
        "Không tìm thấy tổ tiên chung đủ gần trong dữ liệu phả hệ hiện tại.",
      isBloodRelated: false,
    };
  }

  const confidence: DnaRelationshipPrediction["confidence"] =
    inference.sourceToTarget.base === "relative" ? "medium" : "high";

  const estimatedSharedDnaPercent = estimateDnaPercent(
    inference.sourceToTarget.base,
    inference.analysis.upCount,
    inference.analysis.downCount,
    inference.sourceToTarget.isBloodRelated,
  );

  const sourceCallLabel = capitalizeFirst(inference.sourceToTarget.label);
  const targetCallLabel = capitalizeFirst(inference.targetToSource.label);
  const relationLabel = sourceCallLabel;
  const localizedPath = inference.relationshipPath.map(
    (step) => relationshipStepLabel[step] ?? step,
  );
  const explanation = `${inference.humanReadable}. Chuỗi quan hệ: [${localizedPath.join(
    " -> ",
  )}]`;

  const isBloodRelated = inference.sourceToTarget.isBloodRelated;

  return {
    relationLabel,
    sourceCallLabel,
    targetCallLabel,
    estimatedSharedDnaPercent,
    confidence,
    explanation,
    isBloodRelated,
  };
};
