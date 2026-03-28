import { useState, useEffect } from "react";
import {
  Plus,
  LayoutGrid,
  AlignLeft,
  Check,
  ChevronsUpDown,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useFamily } from "@/context/useFamily";
import MemberForm from "@/components/MemberForm";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import GenerationGrid from "@/pages/FamilyTree/Grid/Vertical";
import FamilyNode from "@/pages/FamilyTree/Tree/components/FamilyNode";
import { useHorizontalTreeLayout } from "@/pages/FamilyTree/Grid/Horizontal/useHorizontalTreeLayout";
import { paths } from "@/router/paths";
import type { FamilyMemberResponse } from "@/models/FamilyMember";
import { useFamilyTree } from "@/pages/FamilyTree/useFamilyTree";

const nodeTypes = { familyNode: FamilyNode };
const emptyNodes: Node[] = [];
const emptyEdges: Edge[] = [];

export default function FamilyGrid() {
  const { members, deleteMember, loadMembers } = useFamily();
  const {
    members: treeMembers,
    selectedRootId,
    setSelectedRootId,
    rootMembers: treeRootMembers,
    getChildren: getTreeChildren,
    getSpouse: getTreeSpouse,
    loading: treeLoading,
    error: treeError,
  } = useFamilyTree();

  const [viewMode, setViewMode] = useState<"grid" | "htree">("grid");
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterGen, setFilterGen] = useState("");
  const [filterStatus, setFilterStatus] = useState<"alive" | "deceased" | "">(
    "",
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editMember, setEditMember] = useState<FamilyMemberResponse | null>(
    null,
  );
  const [deleteConfirm, setDeleteConfirm] =
    useState<FamilyMemberResponse | null>(null);
  const [openSearch, setOpenSearch] = useState(false);

  const { nodes: layoutNodes, edges: layoutEdges } = useHorizontalTreeLayout(
    treeRootMembers,
    getTreeChildren,
    getTreeSpouse,
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(emptyNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(emptyEdges);

  useEffect(() => {
    setNodes(layoutNodes);
    setEdges(layoutEdges);
  }, [layoutNodes, layoutEdges, setNodes, setEdges]);

  const generations = [...new Set(members.map((m) => m.generation))].sort(
    (a, b) => a - b,
  );

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchGender = !filterGender || m.gender === filterGender;
    const matchGen = !filterGen || m.generation === Number(filterGen);
    const matchStatus =
      !filterStatus ||
      (filterStatus === "alive" ? !m.deathDate : !!m.deathDate);
    return matchSearch && matchGender && matchGen && matchStatus;
  });

  const handleEdit = (member: FamilyMemberResponse) => {
    setEditMember(member);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditMember(null);
    setFormOpen(true);
  };

  const handleDelete = (member: FamilyMemberResponse) => {
    setDeleteConfirm(member);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteMember(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const segmentBtnCls = (active: boolean) =>
    `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer border-none ${
      active
        ? "bg-amber-100 text-amber-700 shadow-sm"
        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
    }`;

  return (
    <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-[fadeIn_0.4s_ease]">
      <PageBreadcrumb
        items={[
          { title: "Trang chủ", link: paths.home },
          { title: "Lưới thế hệ" },
        ]}
      />

      <div className="flex items-center justify-between mb-7 flex-wrap gap-4 max-md:flex-col max-md:items-stretch">
        <div>
          <h1 className="text-[1.75rem] font-bold bg-linear-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            Lưới Thế Hệ
          </h1>
          <p className="text-sm mt-0.5 text-gray-500">
            {members.length} thành viên trong gia phả
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Segmented control */}
          <div className="inline-flex items-center gap-1 p-1 rounded-xl bg-gray-100">
            <button
              className={segmentBtnCls(viewMode === "grid")}
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid size={14} />
              Lưới dọc
            </button>
            <button
              className={segmentBtnCls(viewMode === "htree")}
              onClick={() => setViewMode("htree")}
            >
              <AlignLeft size={14} />
              Sơ đồ ngang
            </button>
          </div>

          {viewMode === "htree" && (
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
                        const m = treeMembers.find(
                          (m) => m.id === selectedRootId,
                        );
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
                      {treeMembers.map((member) => (
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
          )}

          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 whitespace-nowrap text-white bg-linear-to-r from-amber-500 to-orange-600 shadow-sm hover:-translate-y-px hover:shadow-md"
            onClick={handleAdd}
          >
            <Plus size={18} /> Thêm thành viên
          </button>
        </div>
      </div>

      {/* Filters — only for grid mode */}
      {viewMode === "grid" && (
        <div className="flex gap-3 mb-5 flex-wrap max-md:flex-col">
          <Input
            placeholder="Tìm kiếm theo tên..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-50 h-9"
          />
          <Select
            value={filterGender || "all"}
            onValueChange={(v) => setFilterGender(v === "all" ? "" : v)}
          >
            <SelectTrigger className="min-w-40 h-9">
              <SelectValue placeholder="Tất cả giới tính" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả giới tính</SelectItem>
              <SelectItem value="male">Nam</SelectItem>
              <SelectItem value="female">Nữ</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={filterGen || "all"}
            onValueChange={(v) => setFilterGen(v === "all" ? "" : v)}
          >
            <SelectTrigger className="min-w-40 h-9">
              <SelectValue placeholder="Tất cả thế hệ" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả thế hệ</SelectItem>
              {generations.map((g) => (
                <SelectItem key={g} value={String(g)}>
                  Đời {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={filterStatus || "all"}
            onValueChange={(v) =>
              setFilterStatus(v === "all" ? "" : (v as "alive" | "deceased"))
            }
          >
            <SelectTrigger className="min-w-42 h-9">
              <SelectValue placeholder="Tất cả tình trạng" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả tình trạng</SelectItem>
              <SelectItem value="alive">Còn sống</SelectItem>
              <SelectItem value="deceased">Đã mất</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Grid view */}
      {viewMode === "grid" && (
        <GenerationGrid
          members={filtered}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Horizontal tree view */}
      {viewMode === "htree" && (
        <div
          className="w-full overflow-hidden rounded-2xl relative border border-gray-200 shadow-sm"
          style={{ height: "calc(100vh - 220px)" }}
        >
          {treeLoading ? (
            <div className="flex items-center justify-center h-full text-lg text-gray-400">
              Đang tải cây gia phả...
            </div>
          ) : treeError ? (
            <div className="flex items-center justify-center h-full text-lg text-red-500 text-center">
              {treeError}
            </div>
          ) : treeRootMembers.length === 0 ? (
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
      )}

      <MemberForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditMember(null);
        }}
        editMember={editMember}
      />

      {/* Delete confirmation dialog */}
      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(v) => !v && setDeleteConfirm(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa thành viên</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa <strong>{deleteConfirm?.name}</strong> khỏi
              gia phả? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
