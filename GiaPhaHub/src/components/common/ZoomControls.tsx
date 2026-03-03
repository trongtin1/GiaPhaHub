import { ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

const iconBtnCls =
  "inline-flex items-center justify-center w-9 h-9 border-none rounded-lg bg-transparent text-gray-500 cursor-pointer transition-all duration-150 hover:bg-gray-100 hover:text-gray-800";

interface ZoomControlsProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  className?: string;
}

export default function ZoomControls({
  scale,
  onZoomIn,
  onZoomOut,
  onReset,
  className = "",
}: ZoomControlsProps) {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-gray-200 shadow-sm ${className}`}
    >
      <button className={iconBtnCls} onClick={onZoomOut} title="Thu nhỏ">
        <ZoomOut size={18} />
      </button>
      <span className="text-xs font-semibold text-center min-w-10.5 text-gray-500">
        {Math.round(scale * 100)}%
      </span>
      <button className={iconBtnCls} onClick={onZoomIn} title="Phóng to">
        <ZoomIn size={18} />
      </button>
      <button className={iconBtnCls} onClick={onReset} title="Đặt lại">
        <Maximize2 size={18} />
      </button>
    </div>
  );
}
