import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { useFamily } from "@/context/useFamily";
import { useFamilyId } from "@/hooks/useFamilyId";
import { paths } from "@/router/paths";
import type { FamilyMember } from "@/types";

interface TreeNodeProps {
  member: FamilyMember;
}

export default function TreeNode({ member }: TreeNodeProps) {
  const { getChildren, getSpouse } = useFamily();
  const navigate = useNavigate();
  const familyId = useFamilyId();
  const children = getChildren(member.id);
  const spouse = getSpouse(member.id);

  const cardBase =
    "flex flex-col items-center gap-1.5 p-3.5 px-4.5 min-w-[120px] text-center rounded-xl cursor-pointer transition-all duration-250 bg-white hover:-translate-y-0.5 shadow-sm";

  const cardCls = (gender: string, deceased?: string) => {
    const border =
      gender === "male"
        ? "border-2 border-blue-200 hover:border-blue-400 hover:shadow-md hover:shadow-blue-500/10"
        : "border-2 border-pink-200 hover:border-pink-400 hover:shadow-md hover:shadow-pink-500/10";
    return `${cardBase} ${border} ${deceased ? "opacity-60" : ""}`;
  };

  const avatarCls = (gender: string) =>
    gender === "male"
      ? "w-9 h-9 rounded-full flex items-center justify-center bg-blue-50 text-blue-500"
      : "w-9 h-9 rounded-full flex items-center justify-center bg-pink-50 text-pink-500";

  return (
    <li className="flex flex-col items-center relative">
      <div
        className={`relative ${spouse ? "tree-couple" : "flex items-center"}`}
      >
        <div
          className={cardCls(member.gender, member.deathDate)}
          onClick={() => navigate(paths.member(familyId, member.id))}
        >
          <div className={avatarCls(member.gender)}>
            <User size={18} />
          </div>
          <span className="text-xs font-semibold text-gray-900 wrap-break-word">
            {member.name}
          </span>
          {member.birthDate && (
            <span className="text-[0.68rem] text-gray-400">
              {member.birthDate.slice(0, 4)}
              {member.deathDate && `–${member.deathDate.slice(0, 4)}`}
            </span>
          )}
        </div>
        {spouse && (
          <>
            <div
              className="flex items-center px-1.5 text-gray-400 text-sm select-none"
              title="Vợ/Chồng"
            >
              💍
            </div>
            <div
              className={cardCls(spouse.gender, spouse.deathDate)}
              onClick={() => navigate(paths.member(familyId, spouse.id))}
            >
              <div className={avatarCls(spouse.gender)}>
                <User size={18} />
              </div>
              <span className="text-xs font-semibold text-gray-900 wrap-break-word">
                {spouse.name}
              </span>
              {spouse.birthDate && (
                <span className="text-[0.68rem] text-gray-400">
                  {spouse.birthDate.slice(0, 4)}
                  {spouse.deathDate && `–${spouse.deathDate.slice(0, 4)}`}
                </span>
              )}
            </div>
          </>
        )}
      </div>
      {children.length > 0 && (
        <ul className="tree-children">
          {children.map((child) => (
            <TreeNode key={child.id} member={child} />
          ))}
        </ul>
      )}
    </li>
  );
}
