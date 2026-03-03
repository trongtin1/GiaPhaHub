import { useParams, useNavigate, Link } from "react-router-dom";
import {
  User,
  Calendar,
  MapPin,
  Phone,
  Heart,
  ArrowLeft,
  Pencil,
  Users,
  FileText,
} from "lucide-react";
import { useState } from "react";
import { useFamily } from "@/context/useFamily";
import MemberForm from "@/components/MemberForm";
import MemberCard from "@/components/MemberCard";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import { useFamilyId } from "@/hooks/useFamilyId";
import { paths } from "@/router/paths";

export default function MemberDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const familyId = useFamilyId();
  const { getMember, getChildren, getSpouse, getParent } = useFamily();
  const [editOpen, setEditOpen] = useState(false);
  const member = getMember(id!);

  if (!member) {
    return (
      <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
          <h2 className="text-gray-500">Không tìm thấy thành viên</h2>
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 border-none rounded-lg text-sm font-semibold cursor-pointer text-white bg-linear-to-r from-amber-500 to-orange-600"
            onClick={() => navigate(paths.members(familyId))}
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  const parent = getParent(member.id);
  const spouse = getSpouse(member.id);
  const children = getChildren(member.id);
  const spouseChildren = spouse ? getChildren(spouse.id) : [];
  const allChildren = [
    ...children,
    ...spouseChildren.filter((sc) => !children.find((c) => c.id === sc.id)),
  ];

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

  const avatarCls =
    member.gender === "male"
      ? "bg-blue-50 text-blue-500 border-blue-200"
      : "bg-pink-50 text-pink-500 border-pink-200";

  const fieldRow = (icon: React.ReactNode, label: string, value: string) => (
    <div className="flex items-start gap-3">
      <span className="shrink-0 mt-0.5 text-gray-400">{icon}</span>
      <div>
        <label className="block text-xs mb-0.5 text-gray-400">{label}</label>
        <span className="text-sm text-gray-800">{value}</span>
      </div>
    </div>
  );

  return (
    <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-[fadeIn_0.4s_ease]">
      <PageBreadcrumb
        items={[
          { title: "Trang chủ", link: paths.home },
          { title: "Thành viên", link: paths.members(familyId) },
          { title: "Chi tiết" },
        ]}
      />

      <div className="flex items-center justify-between mb-7 flex-wrap gap-4">
        <button
          className="bg-transparent px-3.5 py-2 text-gray-500 hover:bg-gray-50 hover:text-gray-800 text-sm font-semibold cursor-pointer border-none rounded-lg transition-all duration-150 inline-flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} /> Quay lại
        </button>
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 text-white bg-linear-to-r from-amber-500 to-orange-600 shadow-sm hover:-translate-y-px hover:shadow-md"
          onClick={() => setEditOpen(true)}
        >
          <Pencil size={16} /> Chỉnh sửa
        </button>
      </div>

      {/* Hero */}
      <div className="flex items-center gap-6 mb-8 p-8 rounded-2xl bg-white border border-gray-100 shadow-sm max-md:flex-col max-md:text-center">
        <div
          className={`w-22.5 h-22.5 rounded-full flex items-center justify-center shrink-0 border-[3px] ${avatarCls}`}
        >
          <User size={48} />
        </div>
        <div>
          <h1 className="text-[1.75rem] font-bold mb-2 text-gray-900">
            {member.name}
          </h1>
          <div className="flex gap-2 flex-wrap">
            <span
              className={`text-[0.72rem] font-semibold px-3 py-0.5 rounded-full ${member.gender === "male" ? "bg-blue-50 text-blue-600" : "bg-pink-50 text-pink-600"}`}
            >
              {member.gender === "male" ? "Nam" : "Nữ"}
            </span>
            <span className="text-[0.72rem] font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600">
              Đời {member.generation}
            </span>
            {member.deathDate && (
              <span className="text-[0.65rem] font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-500">
                Đã mất
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Detail Grid */}
      <div className="grid grid-cols-2 gap-5 max-lg:grid-cols-1">
        {/* Personal Info */}
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-semibold mb-5 text-amber-600">
            <FileText size={18} /> Thông tin cá nhân
          </h3>
          <div className="flex flex-col gap-4">
            {member.birthDate &&
              fieldRow(<Calendar size={16} />, "Ngày sinh", member.birthDate)}
            {member.deathDate &&
              fieldRow(<Calendar size={16} />, "Ngày mất", member.deathDate)}
            {age !== null &&
              fieldRow(
                <User size={16} />,
                member.deathDate ? "Hưởng thọ" : "Tuổi",
                `${age} tuổi`,
              )}
            {member.phone &&
              fieldRow(<Phone size={16} />, "Số điện thoại", member.phone)}
            {member.address &&
              fieldRow(<MapPin size={16} />, "Địa chỉ", member.address)}
          </div>
          {member.bio && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <label className="block text-xs mb-2 text-gray-400">
                Tiểu sử
              </label>
              <p className="text-sm leading-relaxed text-gray-600">
                {member.bio}
              </p>
            </div>
          )}
        </div>

        {/* Relationships */}
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <h3 className="flex items-center gap-2 text-base font-semibold mb-5 text-amber-600">
            <Heart size={18} /> Quan hệ gia đình
          </h3>
          <div className="flex flex-col gap-5">
            {parent && (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2 text-gray-400">
                  Cha / Mẹ
                </label>
                <Link
                  to={paths.member(familyId, parent.id)}
                  className="inline-flex items-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm no-underline transition-all duration-150 bg-gray-50 border border-gray-200 text-gray-800 hover:border-amber-400 hover:text-amber-600"
                >
                  <User size={16} /> {parent.name}
                </Link>
              </div>
            )}
            {spouse && (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2 text-gray-400">
                  Vợ / Chồng
                </label>
                <Link
                  to={paths.member(familyId, spouse.id)}
                  className="inline-flex items-center gap-2 py-2.5 px-4 rounded-lg font-medium text-sm no-underline transition-all duration-150 bg-gray-50 border border-gray-200 text-gray-800 hover:border-amber-400 hover:text-amber-600"
                >
                  <Heart size={16} /> {spouse.name}
                </Link>
              </div>
            )}
            {allChildren.length > 0 && (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider mb-2 text-gray-400">
                  <Users size={14} /> Con cái ({allChildren.length})
                </label>
                <div className="flex flex-col gap-1.5">
                  {allChildren.map((child) => (
                    <MemberCard key={child.id} member={child} compact />
                  ))}
                </div>
              </div>
            )}
            {!parent && !spouse && allChildren.length === 0 && (
              <p className="italic text-sm text-gray-400">
                Chưa có thông tin quan hệ
              </p>
            )}
          </div>
        </div>
      </div>

      <MemberForm
        open={editOpen}
        onClose={() => setEditOpen(false)}
        editMember={member}
      />
    </div>
  );
}
