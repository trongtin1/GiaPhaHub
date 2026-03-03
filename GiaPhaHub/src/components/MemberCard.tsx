import { useNavigate } from "react-router-dom";
import { User, Calendar, MapPin, Heart } from "lucide-react";
import type { FamilyMember } from "@/types";
import { useFamily } from "@/context/useFamily";

interface MemberCardProps {
  member: FamilyMember;
  compact?: boolean;
}

export default function MemberCard({ member, compact }: MemberCardProps) {
  const navigate = useNavigate();
  const { getSpouse } = useFamily();
  const spouse = getSpouse(member.id);

  const age = member.birthDate
    ? (() => {
        const endDate = member.deathDate
          ? new Date(member.deathDate)
          : new Date();
        const birth = new Date(member.birthDate);
        return Math.floor(
          (endDate.getTime() - birth.getTime()) /
            (365.25 * 24 * 60 * 60 * 1000),
        );
      })()
    : null;

  const avatarColor =
    member.gender === "male"
      ? "bg-blue-50 text-blue-500"
      : "bg-pink-50 text-pink-500";

  return (
    <div
      className={`flex items-center gap-3 ${compact ? "p-2 px-3" : "p-3 px-3.5"} rounded-xl cursor-pointer transition-all duration-250 bg-gray-50 border border-gray-100 hover:translate-x-0.5 hover:bg-white hover:border-gray-200 hover:shadow-sm ${member.deathDate ? "opacity-65" : ""}`}
      onClick={() => navigate(`/member/${member.id}`)}
    >
      <div
        className={`${compact ? "w-8 h-8" : "w-10 h-10"} rounded-full flex items-center justify-center shrink-0 ${avatarColor}`}
      >
        <User size={compact ? 20 : 28} />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold truncate text-gray-900">
          {member.name}
        </h4>
        {!compact && (
          <>
            <div className="flex gap-3.5 flex-wrap mt-0.5">
              {member.birthDate && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <Calendar size={13} />
                  {member.birthDate}
                  {member.deathDate && ` — ${member.deathDate}`}
                  {age !== null && ` (${age} tuổi)`}
                </span>
              )}
            </div>
            <div className="flex gap-3.5 flex-wrap mt-0.5">
              {member.address && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <MapPin size={13} />
                  {member.address}
                </span>
              )}
              {spouse && (
                <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                  <Heart size={13} />
                  {spouse.name}
                </span>
              )}
            </div>
          </>
        )}
      </div>
      <span className="text-[0.7rem] font-semibold whitespace-nowrap px-2 py-0.5 rounded-full text-amber-600 bg-amber-50">
        Đời {member.generation}
      </span>
    </div>
  );
}
