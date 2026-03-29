import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { useNavigate } from "react-router-dom";
import { useFamilyId } from "@/hooks/useFamilyId";
import { paths } from "@/router/paths";
import { MemberCard } from "./MemberCard";
import type { TreeNodeData } from "../Tree/useTreeLayout";
import { Plus, Minus } from "lucide-react";

const handleStyle = "!bg-gray-400 !w-2 !h-2 !border-2 !border-white";

export default function FamilyNode({ data }: NodeProps) {
  const {
    member,
    spouse,
    direction,
    hasChildren,
    isCollapsed,
    onToggleCollapse,
    showHandles = true,
    showCollapseToggle = true,
  } = data as TreeNodeData & {
    direction?: "horizontal";
    showHandles?: boolean;
    showCollapseToggle?: boolean;
  };
  const navigate = useNavigate();
  const familyId = useFamilyId();
  const isHorizontal = direction === "horizontal";

  const goTo = (id: number) => navigate(paths.member(familyId, id));

  return (
    <div className="flex items-center relative">
      {showHandles && (
        <Handle
          type="target"
          position={isHorizontal ? Position.Left : Position.Top}
          className={handleStyle}
        />
      )}

      <MemberCard member={member} onClick={() => goTo(member.id)} />

      {spouse && (
        <>
          <span className="px-1.5 text-gray-400 text-sm select-none">💍</span>
          <MemberCard member={spouse} onClick={() => goTo(spouse.id)} />
        </>
      )}

      {showHandles && (
        <Handle
          type="source"
          position={isHorizontal ? Position.Right : Position.Bottom}
          className={handleStyle}
        />
      )}

      {showCollapseToggle && hasChildren && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleCollapse?.(member.id);
          }}
          title={isCollapsed ? "Mở rộng" : "Thu gọn"}
          className={`absolute z-10 w-5 h-5 bg-white border border-gray-300 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-amber-600 cursor-pointer shadow-sm transition-colors ${
            isHorizontal
              ? "-right-2.5 top-1/2 -translate-y-1/2"
              : "-bottom-2.5 left-1/2 -translate-x-1/2"
          }`}
        >
          {isCollapsed ? <Plus size={14} /> : <Minus size={14} />}
        </button>
      )}
    </div>
  );
}
