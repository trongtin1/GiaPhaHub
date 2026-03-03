import { useState } from "react";
import { Plus } from "lucide-react";
import { useZoomPan } from "@/hooks/useZoomPan";
import ZoomControls from "@/components/common/ZoomControls";
import { Input, Select, Modal, Segmented } from "antd";
import {
  ExclamationCircleFilled,
  AppstoreOutlined,
  AlignLeftOutlined,
} from "@ant-design/icons";
import { useFamily } from "@/context/useFamily";
import MemberForm from "@/components/MemberForm";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import GenerationGrid from "@/pages/Member/components/GenerationGrid";
import HorizontalTreeNode from "@/pages/FamilyTree/HorizontalTree/components/HorizontalTreeNode";
import { paths } from "@/router/paths";
import type { FamilyMember } from "@/types";
import "@/pages/FamilyTree/HorizontalTree/css/htree.css";

export default function FamilyGrid() {
  const { members, deleteMember, getRootMembers } = useFamily();

  const [viewMode, setViewMode] = useState<"grid" | "htree">("grid");
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterGen, setFilterGen] = useState("");
  const [filterStatus, setFilterStatus] = useState<"alive" | "deceased" | "">(
    "",
  );
  const [formOpen, setFormOpen] = useState(false);
  const [editMember, setEditMember] = useState<FamilyMember | null>(null);

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

  const handleEdit = (member: FamilyMember) => {
    setEditMember(member);
    setFormOpen(true);
  };

  const handleAdd = () => {
    setEditMember(null);
    setFormOpen(true);
  };

  const handleDelete = (member: FamilyMember) => {
    Modal.confirm({
      title: "Xóa thành viên",
      icon: <ExclamationCircleFilled />,
      content: (
        <>
          Bạn có chắc muốn xóa <strong>{member.name}</strong> khỏi gia phả? Hành
          động này không thể hoàn tác.
        </>
      ),
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        deleteMember(member.id);
      },
    });
  };

  const rootMembers = getRootMembers();

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
          <Segmented
            value={viewMode}
            onChange={(v) => setViewMode(v as "grid" | "htree")}
            options={[
              { value: "grid", label: "Lưới dọc", icon: <AppstoreOutlined /> },
              {
                value: "htree",
                label: "Sơ đồ ngang",
                icon: <AlignLeftOutlined />,
              },
            ]}
          />
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
          <Input.Search
            placeholder="Tìm kiếm theo tên..."
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={(v) => setSearch(v)}
            className="flex-1 min-w-50"
          />
          <Select
            value={filterGender || undefined}
            onChange={(v) => setFilterGender(v ?? "")}
            placeholder="Tất cả giới tính"
            allowClear
            style={{ minWidth: 160 }}
            options={[
              { value: "male", label: "Nam" },
              { value: "female", label: "Nữ" },
            ]}
          />
          <Select
            value={filterGen || undefined}
            onChange={(v) => setFilterGen(v ?? "")}
            placeholder="Tất cả thế hệ"
            allowClear
            style={{ minWidth: 160 }}
            options={generations.map((g) => ({
              value: String(g),
              label: `Đời ${g}`,
            }))}
          />
          <Select
            value={filterStatus || undefined}
            onChange={(v) =>
              setFilterStatus((v ?? "") as "alive" | "deceased" | "")
            }
            placeholder="Tất cả tình trạng"
            allowClear
            style={{ minWidth: 170 }}
            options={[
              { value: "alive", label: "Còn sống" },
              { value: "deceased", label: "Đã mất" },
            ]}
          />
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
            {rootMembers.length > 0 ? (
              <ul className="list-none flex flex-col gap-0">
                {rootMembers.map((root) => (
                  <HorizontalTreeNode key={root.id} member={root} />
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
    </div>
  );
}
