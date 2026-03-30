import { useMemo } from "react";
import type { Node, Edge } from "@xyflow/react";
import type { FamilyMemberResponse } from "@/models/FamilyMember";

/* ── Constants ────────────────────────────────────────────── */
const NODE_W = 140;
const COUPLE_W = 310;
const NODE_H = 110;
const GAP_X = 40;
const GAP_Y = 160;

const EDGE_STYLE = {
  stroke: "#9ca3af",
  strokeWidth: 2,
  strokeDasharray: "6 4",
};

/* ── Types ────────────────────────────────────────────────── */
export interface TreeNodeData {
  member: FamilyMemberResponse;
  spouse?: FamilyMemberResponse;
  hasChildren?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: (id: number) => void;
  showHandles?: boolean;
  showCollapseToggle?: boolean;
  [key: string]: unknown;
}

export interface TreeLayoutOptions {
  showHandles?: boolean;
  showCollapseToggle?: boolean;
}

type GetChildren = (m: FamilyMemberResponse) => FamilyMemberResponse[];
type GetSpouse = (m: FamilyMemberResponse) => FamilyMemberResponse | undefined;

/* ── Helpers ──────────────────────────────────────────────── */
function getSubtreeWidth(
  member: FamilyMemberResponse,
  getChildren: GetChildren,
  getSpouse: GetSpouse,
  collapsedIds: Set<number>,
): number {
  const selfW = getSpouse(member) ? COUPLE_W : NODE_W;
  const children = getChildren(member);
  if (children.length === 0 || collapsedIds.has(member.id)) return selfW;

  const childrenW = children.reduce(
    (sum, c) => sum + getSubtreeWidth(c, getChildren, getSpouse, collapsedIds),
    0,
  );
  return Math.max(selfW, childrenW + (children.length - 1) * GAP_X);
}

function buildNodes(
  member: FamilyMemberResponse,
  cx: number,
  cy: number,
  getChildren: GetChildren,
  getSpouse: GetSpouse,
  layoutOptions: Required<TreeLayoutOptions>,
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
    position: { x: cx - (spouse ? COUPLE_W : NODE_W) / 2, y: cy },
    data: {
      member,
      spouse,
      hasChildren,
      isCollapsed,
      onToggleCollapse,
      showHandles: layoutOptions.showHandles,
      showCollapseToggle: layoutOptions.showCollapseToggle,
    } satisfies TreeNodeData,
  });

  if (!hasChildren || isCollapsed) return;

  const children = allChildren;

  const widths = children.map((c) =>
    getSubtreeWidth(c, getChildren, getSpouse, collapsedIds),
  );
  const totalW =
    widths.reduce((s, w) => s + w, 0) + (children.length - 1) * GAP_X;
  let x = cx - totalW / 2;
  const childY = cy + NODE_H + GAP_Y;

  children.forEach((child, i) => {
    const childCx = x + widths[i] / 2;
    buildNodes(
      child,
      childCx,
      childY,
      getChildren,
      getSpouse,
      layoutOptions,
      collapsedIds,
      onToggleCollapse,
      nodes,
      edges,
    );
    edges.push({
      id: `e-${member.id}-${child.id}`,
      source: nodeId,
      target: `n-${child.id}`,
      type: "smoothstep",
      style: EDGE_STYLE,
    });
    x += widths[i] + GAP_X;
  });
}

/* ── Hook ─────────────────────────────────────────────────── */
export function useTreeLayout(
  roots: FamilyMemberResponse[],
  getChildren: GetChildren,
  getSpouse: GetSpouse,
  collapsedIds: Set<number>,
  onToggleCollapse: (id: number) => void,
  options: TreeLayoutOptions = {},
) {
  const showHandles = options.showHandles ?? true;
  const showCollapseToggle = options.showCollapseToggle ?? true;

  return useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    if (roots.length === 0) return { nodes, edges };

    const layoutOptions: Required<TreeLayoutOptions> = {
      showHandles,
      showCollapseToggle,
    };

    const widths = roots.map((r) =>
      getSubtreeWidth(r, getChildren, getSpouse, collapsedIds),
    );
    const totalW =
      widths.reduce((s, w) => s + w, 0) + (roots.length - 1) * GAP_X * 2;
    let x = -totalW / 2;

    roots.forEach((root, i) => {
      buildNodes(
        root,
        x + widths[i] / 2,
        0,
        getChildren,
        getSpouse,
        layoutOptions,
        collapsedIds,
        onToggleCollapse,
        nodes,
        edges,
      );
      x += widths[i] + GAP_X * 2;
    });

    return { nodes, edges };
  }, [
    roots,
    getChildren,
    getSpouse,
    collapsedIds,
    onToggleCollapse,
    showCollapseToggle,
    showHandles,
  ]);
}
