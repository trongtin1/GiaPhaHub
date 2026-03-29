import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import type { Node, Edge } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useEffect, useState } from "react";

import { useHorizontalTreeLayout } from "./useHorizontalTreeLayout";
import FamilyNode from "@/pages/FamilyTree/components/FamilyNode";
import type { FamilyMemberResponse } from "@/models/FamilyMember";

const nodeTypes = { familyNode: FamilyNode };
const emptyNodes: Node[] = [];
const emptyEdges: Edge[] = [];

export interface HorizontalFamilyTreeProps {
  rootMembers: FamilyMemberResponse[];
  getChildren: (member: FamilyMemberResponse) => FamilyMemberResponse[];
  getSpouse: (member: FamilyMemberResponse) => FamilyMemberResponse | undefined;
}

export default function HorizontalFamilyTree({
  rootMembers,
  getChildren,
  getSpouse,
}: HorizontalFamilyTreeProps) {
  const [collapsedIds, setCollapsedIds] = useState<Set<number>>(new Set());

  const toggleCollapse = (id: number) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const { nodes: layoutNodes, edges: layoutEdges } = useHorizontalTreeLayout(
    rootMembers,
    getChildren,
    getSpouse,
    collapsedIds,
    toggleCollapse,
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(emptyNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(emptyEdges);

  useEffect(() => {
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [layoutNodes, layoutEdges, setNodes, setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{ padding: 0.3 }}
      minZoom={0.1}
      maxZoom={2}
      proOptions={{ hideAttribution: true }}
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={20}
        size={1}
        color="#d1d5db"
      />
      <Controls showInteractive={false} />
      <MiniMap
        nodeColor={(n) => {
          const data = n.data as { member?: { gender?: string } };
          return data?.member?.gender === "male" ? "#93c5fd" : "#f9a8d4";
        }}
      />
    </ReactFlow>
  );
}
