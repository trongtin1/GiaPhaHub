import { useZoomPan } from "@/hooks/useZoomPan";
import TreeNode from "@/pages/FamilyTree/Tree/components/TreeNode";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import ZoomControls from "@/components/common/ZoomControls";
import { useFamilyTree } from "@/pages/FamilyTree/useFamilyTree";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import "./css/tree.css";

export default function FamilyTree() {
  const {
    members,
    selectedRootId,
    setSelectedRootId,
    getRootMembers,
    getChildren,
    getSpouse,
    loading,
    error,
  } = useFamilyTree();
  const rootMembers = getRootMembers();
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
  } = useZoomPan();

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
          <div className="flex items-center gap-3 flex-wrap">
            <Select
              value={selectedRootId ? String(selectedRootId) : undefined}
              onValueChange={(v) => setSelectedRootId(Number(v))}
            >
              <SelectTrigger className="min-w-60 h-9">
                <SelectValue placeholder="Chọn thành viên gốc" />
              </SelectTrigger>
              <SelectContent>
                {members.map((member) => (
                  <SelectItem key={member.id} value={String(member.id)}>
                    {member.name} (Đời {member.generation})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ZoomControls
              scale={scale}
              onZoomIn={zoomIn}
              onZoomOut={zoomOut}
              onReset={reset}
            />
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        className="w-full overflow-hidden rounded-2xl relative border border-gray-200 shadow-sm"
        style={{
          height: "calc(100vh - 200px)",
          background:
            "radial-gradient(circle at 50% 50%, rgba(251,191,36,0.04) 0%, transparent 70%), #fafafa",
          cursor: dragging ? "grabbing" : "grab",
        }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div
          className="inline-flex justify-center px-20 py-15 min-w-full origin-top"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center min-h-75 text-lg text-gray-400">
              <p>Đang tải cây gia phả...</p>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center min-h-75 text-lg text-red-500 text-center">
              <p>{error}</p>
            </div>
          ) : rootMembers.length > 0 ? (
            <ul className="list-none flex justify-center">
              {rootMembers.map((root) => (
                <TreeNode
                  key={root.id}
                  member={root}
                  getChildren={getChildren}
                  getSpouse={getSpouse}
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
    </div>
  );
}
