import { Handle, Position } from "@xyflow/react";
import type { NodeProps } from "@xyflow/react";
import { useNavigate } from "react-router-dom";
import { useFamilyId } from "@/hooks/useFamilyId";
import { paths } from "@/router/paths";
import { MemberCard } from "./MemberCard";
import type { TreeNodeData } from "../useTreeLayout";

const handleStyle = "!bg-gray-400 !w-2 !h-2 !border-2 !border-white";

export default function FamilyNode({ data }: NodeProps) {
  const { member, spouse, direction } = data as TreeNodeData & { direction?: "horizontal" };
  const navigate = useNavigate();
  const familyId = useFamilyId();
  const isHorizontal = direction === "horizontal";

  const goTo = (id: number) => navigate(paths.member(familyId, id));

  return (
    <div className="flex items-center">
      <Handle
        type="target"
        position={isHorizontal ? Position.Left : Position.Top}
        className={handleStyle}
      />

      <MemberCard member={member} onClick={() => goTo(member.id)} />

      {spouse && (
        <>
          <span className="px-1.5 text-gray-400 text-sm select-none">💍</span>
          <MemberCard member={spouse} onClick={() => goTo(spouse.id)} />
        </>
      )}

      <Handle
        type="source"
        position={isHorizontal ? Position.Right : Position.Bottom}
        className={handleStyle}
      />
    </div>
  );
}
