import { useFamily } from "@/context/useFamily";
import { useZoomPan } from "@/hooks/useZoomPan";
import HorizontalTreeNode from "@/pages/FamilyTree/HorizontalTree/components/HorizontalTreeNode";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import ZoomControls from "@/components/common/ZoomControls";
import { paths } from "@/router/paths";
import "./css/htree.css";

export default function HorizontalFamilyTree() {
  const { getRootMembers } = useFamily();
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
          items={[
            { title: "Trang chủ", link: paths.home },
            { title: "Sơ đồ ngang" },
          ]}
        />

        <div className="flex items-center justify-between mb-5 flex-wrap gap-4 max-md:flex-col max-md:items-stretch">
          <div>
            <h1 className="text-[1.75rem] font-bold bg-linear-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Sơ Đồ Ngang
            </h1>
            <p className="text-sm mt-0.5 text-gray-500">
              Sơ đồ gia phả theo chiều ngang từ trái sang phải
            </p>
          </div>

          <ZoomControls
            scale={scale}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onReset={reset}
          />
        </div>
      </div>

      {/* Canvas */}
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
    </div>
  );
}
