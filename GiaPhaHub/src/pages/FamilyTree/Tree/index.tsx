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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import { useFamilyTree } from "@/pages/FamilyTree/useFamilyTree";
import { useTreeLayout } from "./useTreeLayout";
import FamilyNode from "./components/FamilyNode";

const nodeTypes = { familyNode: FamilyNode };
const emptyNodes: Node[] = [];
const emptyEdges: Edge[] = [];

export default function FamilyTree() {
  const [openSearch, setOpenSearch] = useState(false);
  const {
    members,
    selectedRootId,
    setSelectedRootId,
    rootMembers,
    getChildren,
    getSpouse,
    loading,
    error,
  } = useFamilyTree();

  const { nodes: layoutNodes, edges: layoutEdges } = useTreeLayout(
    rootMembers,
    getChildren,
    getSpouse,
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(emptyNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(emptyEdges);

  useEffect(() => {
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [layoutNodes, layoutEdges, setNodes, setEdges]);

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-[fadeIn_0.4s_ease]">
      <div className="max-w-300 mx-auto">
        <PageBreadcrumb
          items={[{ title: "Trang chủ", link: "/" }, { title: "Cây gia phả" }]}
        />
        <div className="flex items-center justify-between mb-5 flex-wrap gap-4 max-md:flex-col max-md:items-stretch">
          <div>
            <h1 className="text-[1.75rem] font-bold bg-linear-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Cây Gia Phả
            </h1>
            <p className="text-sm mt-0.5 text-gray-500">
              Sơ đồ trực quan các mối quan hệ trong dòng họ
            </p>
          </div>

          <Popover open={openSearch} onOpenChange={setOpenSearch}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openSearch}
                className="min-w-60 h-9 justify-between font-normal"
              >
                {selectedRootId
                  ? (() => {
                      const m = members.find((m) => m.id === selectedRootId);
                      return m
                        ? `${m.name} (Đời ${m.generation})`
                        : "Chọn thành viên gốc";
                    })()
                  : "Chọn thành viên gốc"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-75 p-0" align="start">
              <Command>
                <CommandInput placeholder="Tìm kiếm thành viên..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy thành viên nào.</CommandEmpty>
                  <CommandGroup>
                    {members.map((member) => (
                      <CommandItem
                        key={member.id}
                        value={`${member.name} ${member.generation} ${member.id}`}
                        onSelect={() => {
                          setSelectedRootId(member.id);
                          setOpenSearch(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedRootId === member.id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {member.name} (Đời {member.generation})
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* React Flow canvas */}
      <div
        className="w-full overflow-hidden rounded-2xl relative border border-gray-200 shadow-sm"
        style={{ height: "calc(100vh - 200px)" }}
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
        )}
      </div>
    </div>
  );
}
