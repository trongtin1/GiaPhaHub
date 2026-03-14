import { FamilyMemberResponse } from "@/models/FamilyMember";
import { User } from "lucide-react";

export default function MemberCard({
  member,
  onClick,
}: {
  member: FamilyMemberResponse;
  onClick: () => void;
}) {
  const isMale = member.gender === "male";
  const borderCls = isMale
    ? "border-blue-200 hover:border-blue-400 hover:shadow-blue-500/10"
    : "border-pink-200 hover:border-pink-400 hover:shadow-pink-500/10";
  const avatarBg = isMale
    ? "bg-blue-50 text-blue-400"
    : "bg-pink-50 text-pink-400";

  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 p-3 min-w-42.5 max-w-52.5 bg-white border-2 rounded-xl cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md shadow-sm select-none ${borderCls} ${member.deathDate ? "opacity-60" : ""}`}
    >
      {/* Avatar */}
      <div
        className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center ${avatarBg} overflow-hidden`}
      >
        {member.avatar ? (
          <img
            src={member.avatar}
            alt={member.name}
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          <User size={22} />
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="text-sm font-semibold text-gray-900 truncate leading-tight">
          {member.name}
        </span>
        {member.birthDate && (
          <span className="text-xs text-gray-500 leading-tight">
            {member.birthDate.slice(0, 4)}
            {member.deathDate ? `–${member.deathDate.slice(0, 4)}` : ""}
          </span>
        )}
      </div>
    </div>
  );
}
