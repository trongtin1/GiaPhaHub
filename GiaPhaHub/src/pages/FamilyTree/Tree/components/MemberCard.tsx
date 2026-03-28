import { User } from "lucide-react";
import type { FamilyMemberResponse } from "@/models/FamilyMember";

export function MemberCard({
  member,
  onClick,
}: {
  member: FamilyMemberResponse;
  onClick: () => void;
}) {
  const isMale = member.gender === "male";

  return (
    <div
      className={`
        flex flex-col items-center gap-1.5 p-3.5 px-4.5 min-w-30
        text-center rounded-xl cursor-pointer transition-all duration-250
        bg-white hover:-translate-y-0.5 shadow-sm
        border-2 ${isMale ? "border-blue-200 hover:border-blue-400 hover:shadow-blue-500/10" : "border-pink-200 hover:border-pink-400 hover:shadow-pink-500/10"}
        ${member.deathDate ? "opacity-60" : ""}
      `}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div
        className={`w-9 h-9 rounded-full flex items-center justify-center ${isMale ? "bg-blue-50 text-blue-500" : "bg-pink-50 text-pink-500"}`}
      >
        <User size={18} />
      </div>
      <span className="text-xs font-semibold text-gray-900 wrap-break-word max-w-25">
        {member.name}
      </span>
      {member.birthDate && (
        <span className="text-[0.68rem] text-gray-400">
          {member.birthDate.slice(0, 4)}
          {member.deathDate && `–${member.deathDate.slice(0, 4)}`}
        </span>
      )}
    </div>
  );
}

export default MemberCard;
