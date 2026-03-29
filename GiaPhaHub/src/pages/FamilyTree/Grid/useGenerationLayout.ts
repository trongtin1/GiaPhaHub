import { useMemo } from "react";
import type { Edge, Node } from "@xyflow/react";
import type { FamilyMemberResponse } from "@/models/FamilyMember";

const NODE_W = 140;
const NODE_H = 110;
const GAP_X = 30;
const GAP_Y = 70;

const EDGE_STYLE = {
  stroke: "#d1d5db",
  strokeWidth: 1.5,
};

export function useGenerationLayout(members: FamilyMemberResponse[]) {
  return useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    if (members.length === 0) return { nodes, edges };

    const membersById = new Map<number, FamilyMemberResponse>(
      members.map((member) => [member.id, member]),
    );

    const membersByGeneration = members.reduce<
      Record<number, FamilyMemberResponse[]>
    >((acc, member) => {
      if (!acc[member.generation]) acc[member.generation] = [];
      acc[member.generation].push(member);
      return acc;
    }, {});

    const generations = Object.keys(membersByGeneration)
      .map(Number)
      .sort((a, b) => a - b);

    generations.forEach((generation, rowIndex) => {
      const rowMembers = [...membersByGeneration[generation]].sort(
        (a, b) => a.id - b.id,
      );

      const rowWidth =
        rowMembers.length * NODE_W + Math.max(0, rowMembers.length - 1) * GAP_X;
      let x = -rowWidth / 2;
      const y = rowIndex * (NODE_H + GAP_Y);

      rowMembers.forEach((member) => {
        nodes.push({
          id: `n-${member.id}`,
          type: "familyNode",
          position: { x, y },
          data: {
            member,
            hasChildren: false,
            showHandles: false,
            showCollapseToggle: false,
          },
        });
        x += NODE_W + GAP_X;
      });
    });

    members.forEach((member) => {
      (member.children ?? []).forEach((childId) => {
        if (!membersById.has(childId)) return;
        edges.push({
          id: `eg-${member.id}-${childId}`,
          source: `n-${member.id}`,
          target: `n-${childId}`,
          type: "smoothstep",
          style: EDGE_STYLE,
          animated: false,
        });
      });
    });

    return { nodes, edges };
  }, [members]);
}
