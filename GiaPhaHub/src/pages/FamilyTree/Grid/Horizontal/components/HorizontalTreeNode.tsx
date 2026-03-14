import { useNavigate } from "react-router-dom";

import { useFamilyId } from "@/hooks/useFamilyId";
import { paths } from "@/router/paths";
import type { FamilyMemberResponse } from "@/models/FamilyMember";
import MemberCard from "./MemberCard";

interface HorizontalTreeNodeProps {
  member: FamilyMemberResponse;
  getChildren: (member: FamilyMemberResponse) => FamilyMemberResponse[];
  getSpouse: (member: FamilyMemberResponse) => FamilyMemberResponse | undefined;
}

export default function HorizontalTreeNode({
  member,
  getChildren,
  getSpouse,
}: HorizontalTreeNodeProps) {
  const navigate = useNavigate();
  const familyId = useFamilyId();
  const children = getChildren(member);
  const spouse = getSpouse(member);

  return (
    <li className="htree-node">
      {/* Card(s) */}
      <div className={spouse ? "htree-couple" : "flex items-center"}>
        <MemberCard
          member={member}
          onClick={() => navigate(paths.member(familyId, member.id))}
        />
        {spouse && (
          <>
            <div
              className="flex items-center px-1.5 text-gray-400 text-sm select-none"
              title="Vợ/Chồng"
            >
              💍
            </div>
            <MemberCard
              member={spouse}
              onClick={() => navigate(paths.member(familyId, spouse.id))}
            />
          </>
        )}
      </div>

      {/* Children to the right */}
      {children.length > 0 && (
        <ul className="htree-children">
          {children.map((child) => (
            <HorizontalTreeNode
              key={child.id}
              member={child}
              getChildren={getChildren}
              getSpouse={getSpouse}
            />
          ))}
        </ul>
      )}
    </li>
  );
}
