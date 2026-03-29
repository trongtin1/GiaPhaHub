import { useMemo } from "react";
import type { Node, Edge } from "@xyflow/react";
import type { FamilyMemberResponse } from "@/models/FamilyMember";
import type { TreeNodeData } from "@/pages/FamilyTree/Tree/useTreeLayout";

/* ── Constants (horizontal: X = depth, Y = siblings) ──────── */
const NODE_W = 140;
const COUPLE_W = 310;
const NODE_H = 110;
const GAP_X = 200; // horizontal gap between generations
const GAP_Y = 40; // vertical gap between siblings

const EDGE_STYLE = { stroke: "#9ca3af", strokeWidth: 2, strokeDasharray: "6 4" };

type GetChildren = (m: FamilyMemberResponse) => FamilyMemberResponse[];
type GetSpouse = (m: FamilyMemberResponse) => FamilyMemberResponse | undefined;

/* ── Helpers ──────────────────────────────────────────────── */
function getSubtreeHeight(member: FamilyMemberResponse, getChildren: GetChildren, collapsedIds: Set<number>): number {
  const children = getChildren(member);
  if (children.length === 0 || collapsedIds.has(member.id)) return NODE_H;

  const childrenH = children.reduce((sum, c) => sum + getSubtreeHeight(c, getChildren, collapsedIds), 0);
  return Math.max(NODE_H, childrenH + (children.length - 1) * GAP_Y);
}

function buildNodes(
  member: FamilyMemberResponse,
  cx: number,
  cy: number,
  getChildren: GetChildren,
  getSpouse: GetSpouse,
  collapsedIds: Set<number>,
  onToggleCollapse: (id: number) => void,
  nodes: Node[],
  edges: Edge[],
) {
  const nodeId = `n-${member.id}`;
  const spouse = getSpouse(member);

  const allChildren = getChildren(member);
  const hasChildren = allChildren.length > 0;
  const isCollapsed = collapsedIds.has(member.id);

  nodes.push({
    id: nodeId,
    type: "familyNode",
    position: { x: cx, y: cy - NODE_H / 2 },
    data: { member, spouse, direction: "horizontal", hasChildren, isCollapsed, onToggleCollapse } satisfies TreeNodeData & { direction: string },
  });

  if (!hasChildren || isCollapsed) return;
  
  const children = allChildren;

  const selfW = spouse ? COUPLE_W : NODE_W;
  const childX = cx + selfW + GAP_X;
  const heights = children.map((c) => getSubtreeHeight(c, getChildren, collapsedIds));
  const totalH = heights.reduce((s, h) => s + h, 0) + (children.length - 1) * GAP_Y;
  let y = cy - totalH / 2;

  children.forEach((child, i) => {
    const childCy = y + heights[i] / 2;
    buildNodes(child, childX, childCy, getChildren, getSpouse, collapsedIds, onToggleCollapse, nodes, edges);
    edges.push({
      id: `e-${member.id}-${child.id}`,
      source: nodeId,
      target: `n-${child.id}`,
      type: "smoothstep",
      sourceHandle: undefined,
      targetHandle: undefined,
      style: EDGE_STYLE,
    });
    y += heights[i] + GAP_Y;
  });
}

/* ── Hook ─────────────────────────────────────────────────── */
export function useHorizontalTreeLayout(
  roots: FamilyMemberResponse[],
  getChildren: GetChildren,
  getSpouse: GetSpouse,
  collapsedIds: Set<number>,
  onToggleCollapse: (id: number) => void,
) {
  return useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    if (roots.length === 0) return { nodes, edges };

    const heights = roots.map((r) => getSubtreeHeight(r, getChildren, collapsedIds));
    const totalH = heights.reduce((s, h) => s + h, 0) + (roots.length - 1) * GAP_Y * 2;
    let y = -totalH / 2;

    roots.forEach((root, i) => {
      buildNodes(root, 0, y + heights[i] / 2, getChildren, getSpouse, collapsedIds, onToggleCollapse, nodes, edges);
      y += heights[i] + GAP_Y * 2;
    });

    return { nodes, edges };
  }, [roots, getChildren, getSpouse, collapsedIds, onToggleCollapse]);
}
