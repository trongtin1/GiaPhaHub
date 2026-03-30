import {
  ReactFlow,
  MiniMap,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
} from "@xyflow/react";
import type { Node, Edge, ReactFlowInstance } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import DiagramHeader from "@/pages/FamilyTree/components/DiagramHeader";
import {
  DEFAULT_DIAGRAM_FILTERS,
  type DiagramFilters,
  toFamilyTreeDataFilters,
  toTreeLayoutOptions,
} from "@/pages/FamilyTree/diagramFilters";
import { useFamilyTree } from "@/pages/FamilyTree/useFamilyTree";
import { useHorizontalTreeLayout } from "./useHorizontalTreeLayout";
import FamilyNode from "@/pages/FamilyTree/components/FamilyNode";

const nodeTypes = { familyNode: FamilyNode };
const emptyNodes: Node[] = [];
const emptyEdges: Edge[] = [];

export default function HorizontalFamilyTreePage() {
  const [collapsedIds, setCollapsedIds] = useState<Set<number>>(new Set());
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance<
    Node,
    Edge
  > | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [filters, setFilters] = useState<DiagramFilters>(() => ({
    ...DEFAULT_DIAGRAM_FILTERS,
  }));

  const onFilterChange = useCallback(
    <K extends keyof DiagramFilters>(key: K, value: DiagramFilters[K]) => {
      setFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    [],
  );

  const toggleCollapse = (id: number) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const {
    members,
    selectedRootId,
    setSelectedRootId,
    rootMembers,
    getChildren,
    getSpouse,
    loading,
    error,
  } = useFamilyTree(toFamilyTreeDataFilters(filters));

  const { nodes: layoutNodes, edges: layoutEdges } = useHorizontalTreeLayout(
    rootMembers,
    getChildren,
    getSpouse,
    collapsedIds,
    toggleCollapse,
    toTreeLayoutOptions(filters),
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(emptyNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(emptyEdges);

  const handleZoomOut = () => {
    reactFlowInstance?.zoomOut({ duration: 200 });
  };

  const handleZoomIn = () => {
    reactFlowInstance?.zoomIn({ duration: 200 });
  };

  const handleCenterView = () => {
    reactFlowInstance?.fitView({ padding: 0.3, duration: 280 });
  };

  useEffect(() => {
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [layoutNodes, layoutEdges, setNodes, setEdges]);

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-[fadeIn_0.4s_ease]">
      <div className="max-w-300 mx-auto">
        <DiagramHeader
          title="Sơ Đồ Ngang"
          description="Biểu đồ quan hệ gia đình theo hướng ngang"
          controls={{
            members,
            selectedRootId,
            setSelectedRootId,
            zoomLevel,
            onZoomOut: handleZoomOut,
            onZoomIn: handleZoomIn,
            onCenterView: handleCenterView,
            filters,
            onFilterChange,
            onRootChanged: () => {
              reactFlowInstance?.fitView({
                padding: 0.3,
                duration: 280,
              });
            },
          }}
        />

        <div
          className="w-full overflow-hidden rounded-2xl border border-gray-200 shadow-sm resize-y"
          style={{ height: "calc(100vh - 300px)", minHeight: "400px" }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full text-lg text-gray-400">
              Đang tải cây gia phả...
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-lg text-red-500 text-center">
              {error}
            </div>
          ) : rootMembers.length === 0 ? (
            <div className="flex items-center justify-center h-full text-lg text-gray-400">
              Chưa có thành viên nào. Hãy thêm thành viên đầu tiên!
            </div>
          ) : (
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{ padding: 0.3 }}
              onInit={(instance) => {
                setReactFlowInstance(instance);
                setZoomLevel(instance.getZoom());
              }}
              onMove={(_, viewport) => {
                setZoomLevel(viewport.zoom);
              }}
              minZoom={0.1}
              maxZoom={2}
              proOptions={{ hideAttribution: true }}
            >
              {filters.showBackground && !filters.minimalMode && (
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={20}
                  size={1}
                  color="#d1d5db"
                />
              )}
              {filters.showMiniMap && !filters.minimalMode && (
                <MiniMap
                  nodeColor={(n) => {
                    const data = n.data as { member?: { gender?: string } };
                    return data?.member?.gender === "male"
                      ? "#93c5fd"
                      : "#f9a8d4";
                  }}
                />
              )}
            </ReactFlow>
          )}
        </div>
      </div>
    </div>
  );
}
