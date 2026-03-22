import { useEffect, useState, useCallback } from "react";
import {
  User,
  Calendar,
  MapPin,
  Phone,
  Heart,
  Pencil,
  Users,
  FileText,
  ChevronRight,
  ExternalLink,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useFamily } from "@/context/useFamily";
import MemberForm from "@/components/MemberForm";
import { useAppDispatch } from "@/features";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { useFamilyId } from "@/hooks/useFamilyId";
import { fetchDetailMember } from "@/features/slices/family/thunks";
import { paths } from "@/router/paths";
import {
  getChildrenRefsFromMember,
  mergeMemberRefs,
  type MemberRef,
} from "@/utils/relationshipUtils";

/* ── Extracted sub-component (avoids "component created during render") ── */
function RelationButton({
  icon,
  label,
  name,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  name: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-3.5 py-2.5 text-left text-sm font-medium text-slate-800 transition-all duration-200 hover:border-amber-300 hover:bg-amber-50/60 hover:text-amber-700 cursor-pointer"
    >
      <span className="shrink-0 text-slate-400 transition-colors group-hover:text-amber-500">
        {icon}
      </span>
      <span className="flex-1 min-w-0">
        {label && (
          <span className="block text-[0.65rem] uppercase tracking-wider text-slate-400 mb-0.5">
            {label}
          </span>
        )}
        <span className="block truncate">{name}</span>
      </span>
      <ChevronRight
        size={14}
        className="shrink-0 text-slate-300 transition-colors group-hover:text-amber-400"
      />
    </button>
  );
}

/* ── Main dialog ── */
interface MemberDetailDialogProps {
  memberId: number | null;
  open: boolean;
  onClose: () => void;
}

export default function MemberDetailDialog({
  memberId,
  open,
  onClose,
}: MemberDetailDialogProps) {
  const familyId = useFamilyId();
  const dispatch = useAppDispatch();
  const { getMember, getChildren, getSpouse, getParent } = useFamily();
  const [editOpen, setEditOpen] = useState(false);
  const [history, setHistory] = useState<number[]>([]);
  const [currentId, setCurrentId] = useState<number | null>(null);

  // Sync external memberId with internal state
  useEffect(() => {
    if (open && memberId !== null) {
      if (currentId !== memberId) {
        setCurrentId(memberId);
        setHistory([]);
      }
    } else if (!open) {
      setCurrentId(null);
      setHistory([]);
    }
    // Only run this when open or memberId changes from outside
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, memberId]);

  // Fetch detail data when currentId changes
  useEffect(() => {
    if (
      open &&
      currentId !== null &&
      Number.isFinite(currentId) &&
      currentId > 0
    ) {
      dispatch(fetchDetailMember(currentId));
    }
  }, [dispatch, open, currentId]);

  const member = currentId !== null ? getMember(currentId) : undefined;

  const navigateToMember = useCallback(
    (id: number) => {
      setHistory((prev) => [...prev, currentId!]);
      setCurrentId(id);
    },
    [currentId],
  );

  const navigateBack = useCallback(() => {
    setHistory((prev) => {
      const newHistory = [...prev];
      const prevId = newHistory.pop();
      if (prevId !== undefined) {
        setCurrentId(prevId);
      }
      return newHistory;
    });
  }, []);

  const handleClose = () => {
    setHistory([]);
    setCurrentId(null);
    setEditOpen(false);
    onClose();
  };

  if (!member) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
        <DialogContent className="sm:max-w-4xl rounded-3xl p-0 overflow-hidden gap-0 h-[90vh]">
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            {open
              ? "Đang tải thông tin thành viên..."
              : "Không tìm thấy thành viên"}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const parent = getParent(member.id);
  const spouse = getSpouse(member.id);
  const children = getChildren(member.id);
  const spouseChildren = spouse ? getChildren(spouse.id) : [];
  const allChildrenFromStore: MemberRef[] = [
    ...children,
    ...spouseChildren.filter((sc) => !children.find((c) => c.id === sc.id)),
  ];

  const allChildrenRefs = mergeMemberRefs(
    allChildrenFromStore,
    getChildrenRefsFromMember(member, (childId) => getMember(childId)?.name),
    getChildrenRefsFromMember(spouse, (childId) => getMember(childId)?.name),
  );

  const allChildren = allChildrenRefs.map((childRef) => {
    const found = getMember(childRef.id);
    if (found) return { type: "full" as const, member: found };
    return { type: "basic" as const, member: childRef };
  });

  const isMale = member.gender === "male";
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

  const avatarCls = isMale
    ? "bg-sky-50 text-sky-500 border-sky-200"
    : "bg-rose-50 text-rose-500 border-rose-200";

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className="sm:max-w-4xl rounded-3xl p-0 overflow-hidden gap-0 h-[90vh] flex flex-col"
        showCloseButton={false}
      >
        <div className="relative flex-1 overflow-hidden">
          <div
            className={`absolute inset-0 transition-all duration-300 ease-out ${
              editOpen
                ? "opacity-0 translate-x-4 pointer-events-none"
                : "opacity-100 translate-x-0"
            }`}
          >
            {/* Header gradient + avatar */}
            <div className="relative">
              <div className="h-24 bg-[radial-gradient(circle_at_20%_30%,rgba(251,191,36,0.4),transparent_50%),radial-gradient(circle_at_75%_20%,rgba(249,115,22,0.25),transparent_55%),linear-gradient(135deg,#fff7ed,#fffbeb)]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-full border-[3px] shadow-md ${avatarCls}`}
                >
                  <User size={36} />
                </div>
              </div>
              {/* Back button for navigation within dialog */}
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={navigateBack}
                  className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:text-slate-900 cursor-pointer border border-white/50"
                  aria-label="Quay lại thẻ trước"
                >
                  ← Quay lại
                </button>
              )}

              {/* Floating Top-Right Action Buttons */}
              <div className="absolute right-4 top-4 flex items-center gap-2">
                <Link
                  to={paths.member(familyId, member.id)}
                  className="flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3.5 py-1.5 text-xs font-semibold text-amber-700 shadow-sm backdrop-blur-md transition-all hover:bg-amber-100 hover:text-amber-800 border border-amber-200/50 no-underline"
                >
                  <ExternalLink size={14} /> Xem
                </Link>
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  className="flex items-center gap-1.5 rounded-full bg-amber-100/80 px-3.5 py-1.5 text-xs font-semibold text-amber-700 shadow-sm backdrop-blur-md transition-all hover:bg-amber-100 hover:text-amber-800 border border-amber-200/50 cursor-pointer"
                >
                  <Pencil size={14} /> Chỉnh sửa
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-500 shadow-sm backdrop-blur-md transition-all hover:bg-rose-50 hover:text-rose-600 cursor-pointer border border-white/50"
                  aria-label="Đóng"
                  title="Đóng"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Name + Badges */}
            <DialogHeader className="items-center px-5 pt-12 pb-2">
              <DialogTitle className="text-xl font-bold text-slate-900">
                {member.name}
              </DialogTitle>
              <div className="mt-1.5 flex flex-wrap justify-center gap-1.5">
                <Badge
                  variant="outline"
                  className={`rounded-full text-[0.68rem] ${isMale ? "border-sky-200 bg-sky-50 text-sky-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}
                >
                  {isMale ? "Nam" : "Nữ"}
                </Badge>
                <Badge
                  variant="outline"
                  className="rounded-full border-amber-200 bg-amber-50 text-amber-700 text-[0.68rem]"
                >
                  Đời {member.generation}
                </Badge>
                {member.deathDate && (
                  <Badge className="rounded-full bg-slate-600 text-white text-[0.68rem]">
                    Đã mất
                  </Badge>
                )}
              </div>
            </DialogHeader>

            {/* Content */}
            <div
              className="overflow-y-auto px-5 pb-5 pt-3 scrollbar-thin"
              style={{ height: "calc(90vh - 210px)" }}
            >
              {/* Personal Info Section */}
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-600">
                  <FileText size={15} /> Thông tin cá nhân
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {member.birthDate && (
                    <div className="flex items-center gap-2.5">
                      <Calendar size={14} className="shrink-0 text-slate-400" />
                      <div>
                        <span className="block text-[0.65rem] text-slate-400">
                          Ngày sinh
                        </span>
                        <span className="text-sm text-slate-800">
                          {dayjs(member.birthDate).format("DD/MM/YYYY")}
                          {age !== null &&
                            !member.deathDate &&
                            ` • ${age} tuổi`}
                        </span>
                      </div>
                    </div>
                  )}
                  {member.deathDate && (
                    <div className="flex items-center gap-2.5">
                      <Calendar size={14} className="shrink-0 text-slate-400" />
                      <div>
                        <span className="block text-[0.65rem] text-slate-400">
                          Ngày mất
                        </span>
                        <span className="text-sm text-slate-800">
                          {dayjs(member.deathDate).format("DD/MM/YYYY")}
                          {age !== null && ` • Hưởng thọ ${age} tuổi`}
                        </span>
                      </div>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-2.5">
                      <Phone size={14} className="shrink-0 text-slate-400" />
                      <div>
                        <span className="block text-[0.65rem] text-slate-400">
                          Số điện thoại
                        </span>
                        <span className="text-sm text-slate-800">
                          {member.phone}
                        </span>
                      </div>
                    </div>
                  )}
                  {member.address && (
                    <div className="flex items-center gap-2.5">
                      <MapPin size={14} className="shrink-0 text-slate-400" />
                      <div>
                        <span className="block text-[0.65rem] text-slate-400">
                          Địa chỉ
                        </span>
                        <span className="text-sm text-slate-800">
                          {member.address}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                {member.bio && (
                  <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                    <span className="mb-1 block text-[0.65rem] text-slate-400">
                      Tiểu sử
                    </span>
                    <p className="text-sm leading-relaxed text-slate-700">
                      {member.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Relationships Section */}
              <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-amber-600">
                  <Heart size={15} /> Quan hệ gia đình
                </h3>
                <div className="flex flex-col gap-2">
                  {parent && (
                    <RelationButton
                      icon={<User size={16} />}
                      label="Cha / Mẹ"
                      name={parent.name}
                      onClick={() => navigateToMember(parent.id)}
                    />
                  )}
                  {spouse && (
                    <RelationButton
                      icon={<Heart size={16} />}
                      label="Vợ / Chồng"
                      name={spouse.name}
                      onClick={() => navigateToMember(spouse.id)}
                    />
                  )}
                  {allChildren.length > 0 && (
                    <div>
                      <span className="mb-1.5 flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-slate-400">
                        <Users size={12} /> Con cái ({allChildren.length})
                      </span>
                      <div className="flex flex-col gap-1.5">
                        {allChildren.map((child) => (
                          <RelationButton
                            key={child.member.id}
                            icon={<User size={16} />}
                            label=""
                            name={child.member.name}
                            onClick={() => navigateToMember(child.member.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {!parent && !spouse && allChildren.length === 0 && (
                    <p className="py-3 text-center text-sm italic text-slate-400">
                      Chưa có thông tin quan hệ
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div
            className={`absolute inset-0 transition-all duration-300 ease-out ${
              editOpen
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4 pointer-events-none"
            }`}
          >
            <MemberForm
              open={true}
              onClose={() => setEditOpen(false)}
              editMember={member}
              embedded
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
