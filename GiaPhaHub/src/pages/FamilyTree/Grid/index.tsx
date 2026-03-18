import { useState } from "react";
import { Plus, LayoutGrid, AlignLeft } from "lucide-react";
import { useZoomPan } from "@/hooks/useZoomPan";
import ZoomControls from "@/components/common/ZoomControls";
import { Input } from "@/components/ui/input";
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
import HorizontalTreeNode from "@/pages/FamilyTree/Grid/Horizontal/components/HorizontalTreeNode";
import { paths } from "@/router/paths";
import type { FamilyMemberResponse } from "@/models/FamilyMember";
import { useFamilyTree } from "@/pages/FamilyTree/useFamilyTree";
import "@/pages/FamilyTree/Grid/Horizontal/css/htree.css";

export default function FamilyGrid() {
  const { members, deleteMember } = useFamily();
  const {
    members: treeMembers,
    selectedRootId,
    setSelectedRootId,
    getRootMembers: getTreeRootMembers,
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
  const [deleteConfirm, setDeleteConfirm] = useState<FamilyMemberResponse | null>(null);

  const {
    scale,
    position,
    dragging,
    containerRef,
    zoomIn,
    zoomOut,
    reset,
    onMouseDown,
    onMouseMove,
    onMouseUp,
  } = useZoomPan(viewMode === "htree");

  const generations = [...new Set(members.map((m) => m.generation))].sort(
    (a, b) => a - b,
  );

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

  const treeRootMembers = getTreeRootMembers();

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
            <Select
              value={selectedRootId ? String(selectedRootId) : undefined}
              onValueChange={(v) => setSelectedRootId(Number(v))}
            >
              <SelectTrigger className="min-w-60 h-9">
                <SelectValue placeholder="Chọn thành viên gốc" />
              </SelectTrigger>
              <SelectContent>
                {treeMembers.map((member) => (
                  <SelectItem key={member.id} value={String(member.id)}>
                    {member.name} (Đời {member.generation})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              setFilterStatus(
                v === "all" ? "" : (v as "alive" | "deceased"),
              )
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
          ref={containerRef}
          className="w-full overflow-hidden rounded-2xl relative border border-gray-200 shadow-sm"
          style={{
            height: "calc(100vh - 220px)",
            background:
              "radial-gradient(circle at 50% 50%, rgba(251,191,36,0.04) 0%, transparent 70%), #fafafa",
            cursor: dragging ? "grabbing" : "grab",
          }}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          <ZoomControls
            scale={scale}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onReset={reset}
            className="absolute top-3 right-3 z-10"
          />

          <div
            className="inline-flex items-center px-16 py-14 min-h-full origin-top-left"
            style={{
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            }}
          >
            {treeLoading ? (
              <div className="flex items-center justify-center min-h-75 text-lg text-gray-400">
                <p>Đang tải cây gia phả...</p>
              </div>
            ) : treeError ? (
              <div className="flex items-center justify-center min-h-75 text-lg text-red-500 text-center">
                <p>{treeError}</p>
              </div>
            ) : treeRootMembers.length > 0 ? (
              <ul className="list-none flex flex-col gap-0">
                {treeRootMembers.map((root) => (
                  <HorizontalTreeNode
                    key={root.id}
                    member={root}
                    getChildren={getTreeChildren}
                    getSpouse={getTreeSpouse}
                  />
                ))}
              </ul>
            ) : (
              <div className="flex items-center justify-center min-h-75 text-lg text-gray-400">
                <p>Chưa có thành viên nào. Hãy thêm thành viên đầu tiên!</p>
              </div>
            )}
          </div>
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
      <Dialog open={!!deleteConfirm} onOpenChange={(v) => !v && setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa thành viên</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa <strong>{deleteConfirm?.name}</strong> khỏi gia phả? Hành động này không thể hoàn tác.
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
