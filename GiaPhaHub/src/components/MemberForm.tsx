import { useState } from "react";
import { User, FileText, Heart, X, Save } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFamily } from "@/context/useFamily";
import type {
  FamilyMemberResponse,
  FamilyMemberRequest,
} from "@/models/FamilyMember";
import { getParentId, getSpouseId } from "@/utils/relationshipUtils";

interface MemberFormProps {
  open: boolean;
  onClose: () => void;
  editMember?: FamilyMemberResponse | null;
  embedded?: boolean;
}

interface FormData {
  name: string;
  gender: "male" | "female";
  birthDate: string;
  deathDate: string;
  phone: string;
  address: string;
  bio: string;
  parentId: string;
  spouseId: string;
}

const INITIAL_FORM: FormData = {
  name: "",
  gender: "male",
  birthDate: "",
  deathDate: "",
  phone: "",
  address: "",
  bio: "",
  parentId: "",
  spouseId: "",
};

function MemberFormInner({
  onClose,
  editMember,
}: Omit<MemberFormProps, "open">) {
  const { members, addMember, updateMember } = useFamily();

  const [form, setForm] = useState<FormData>(() => {
    if (!editMember) return INITIAL_FORM;
    const parentId = getParentId(editMember);
    const spouseId = getSpouseId(editMember);
    return {
      name: editMember.name,
      gender: editMember.gender as "male" | "female",
      birthDate: editMember.birthDate || "",
      deathDate: editMember.deathDate || "",
      phone: editMember.phone || "",
      address: editMember.address || "",
      bio: editMember.bio || "",
      parentId: parentId ? String(parentId) : "",
      spouseId: spouseId ? String(spouseId) : "",
    };
  });

  const potentialParents = members.filter(
    (m) => m.id !== editMember?.id && m.id !== Number(form.spouseId),
  );
  const potentialSpouses = members.filter(
    (m) =>
      m.id !== editMember?.id &&
      m.id !== Number(form.parentId) &&
      getParentId(m) !== editMember?.id,
  );

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    let generation = editMember?.generation ?? 1;
    if (form.parentId) {
      const parent = members.find((m) => m.id === Number(form.parentId));
      if (parent) generation = parent.generation + 1;
    }

    const memberData: Omit<FamilyMemberRequest, "id"> = {
      name: form.name.trim(),
      gender: form.gender,
      birthDate: form.birthDate || "",
      deathDate: form.deathDate || "",
      phone: form.phone || "",
      address: form.address || "",
      bio: form.bio || "",
      parentId: Number(form.parentId) || 0,
      spouseId: Number(form.spouseId) || 0,
      spouseRelationship: form.spouseId ? "Vợ/Chồng" : "",
      avatar: "",
      generation,
    };

    if (editMember) {
      updateMember({ id: editMember.id, payload: memberData });
    } else {
      addMember(memberData);
    }
    onClose();
  };

  const isMale = form.gender === "male";
  const avatarCls = isMale
    ? "bg-sky-50 text-sky-500 border-sky-200"
    : "bg-rose-50 text-rose-500 border-rose-200";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full m-0">
      {/* Header gradient + avatar */}
      <div className="relative shrink-0">
        <div className="h-24 bg-[radial-gradient(circle_at_20%_30%,rgba(251,191,36,0.4),transparent_50%),radial-gradient(circle_at_75%_20%,rgba(249,115,22,0.25),transparent_55%),linear-gradient(135deg,#fff7ed,#fffbeb)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full border-[3px] shadow-md bg-white ${avatarCls}`}
          >
            <User size={36} />
          </div>
        </div>

        {/* Floating Top-Right Action Buttons */}
        <div className="absolute right-4 top-4 flex items-center gap-2">
          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-full bg-amber-500/90 px-4 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md transition-all hover:bg-amber-600 hover:text-white border border-amber-600/50 cursor-pointer"
          >
            <Save size={14} /> {editMember ? "Cập nhật" : "Lưu mới"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-500 shadow-sm backdrop-blur-md transition-all hover:bg-rose-50 hover:text-rose-600 cursor-pointer border border-white/50"
            aria-label="Đóng"
            title="Đóng"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="shrink-0 items-center px-5 pt-12 pb-2 text-center">
        <DialogTitle className="text-xl font-bold text-slate-900 mx-auto">
          {editMember ? "Chỉnh sửa thành viên" : "Thêm thành viên mới"}
        </DialogTitle>
        {editMember && (
          <p className="mt-1 text-sm text-slate-500 border-b pb-4 px-10 border-slate-100 mx-auto max-w-sm">
            Thay đổi thông tin cho {editMember.name}
          </p>
        )}
        {!editMember && (
          <p className="mt-1 text-sm text-slate-500 border-b pb-4 px-10 border-slate-100 mx-auto max-w-sm">
            Điền thông tin để thêm thành viên mới vào cây gia phả.
          </p>
        )}
      </div>

      {/* Content Scroll Area */}
      <div
        className="overflow-y-auto px-5 pb-5 scrollbar-thin flex-1"
        style={{ maxHeight: "calc(90vh - 200px)" }}
      >
        <div className="flex flex-col gap-4">
          {/* Personal Info Section */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-amber-600">
              <FileText size={15} /> Thông tin cá nhân
            </h3>

            <div className="flex flex-col gap-4">
              {/* Name field (full width) */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="name" className="text-slate-600 text-[0.8rem]">
                  Họ và tên <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="Nhập họ và tên"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  required
                  className="h-10 rounded-xl"
                />
              </div>

              {/* 2-column grid for others */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label className="text-slate-600 text-[0.8rem]">
                    Giới tính
                  </Label>
                  <Select
                    value={form.gender}
                    onValueChange={(v) => handleChange("gender", v)}
                  >
                    <SelectTrigger className="h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Nam</SelectItem>
                      <SelectItem value="female">Nữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="phone"
                    className="text-slate-600 text-[0.8rem]"
                  >
                    Số điện thoại
                  </Label>
                  <Input
                    id="phone"
                    placeholder="0901234567"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="birthDate"
                    className="text-slate-600 text-[0.8rem]"
                  >
                    Ngày sinh
                  </Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={form.birthDate}
                    onChange={(e) => handleChange("birthDate", e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label
                    htmlFor="deathDate"
                    className="text-slate-600 text-[0.8rem]"
                  >
                    Ngày mất
                  </Label>
                  <Input
                    id="deathDate"
                    type="date"
                    value={form.deathDate}
                    onChange={(e) => handleChange("deathDate", e.target.value)}
                    className="h-10 rounded-xl"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label
                  htmlFor="address"
                  className="text-slate-600 text-[0.8rem]"
                >
                  Địa chỉ
                </Label>
                <Input
                  id="address"
                  placeholder="Nhập địa chỉ"
                  value={form.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="bio" className="text-slate-600 text-[0.8rem]">
                  Tiểu sử
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Nhập tiểu sử ngắn..."
                  rows={3}
                  value={form.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  className="rounded-xl resize-none"
                />
              </div>
            </div>
          </div>

          {/* Relationships Section */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-amber-600">
              <Heart size={15} /> Quan hệ gia đình
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label className="text-slate-600 text-[0.8rem]">Cha / Mẹ</Label>
                <Select
                  value={form.parentId || "none"}
                  onValueChange={(v) =>
                    handleChange("parentId", v === "none" ? "" : v)
                  }
                >
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue placeholder="-- Không --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Không --</SelectItem>
                    {potentialParents.map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.name} (Đời {m.generation})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-1.5">
                <Label className="text-slate-600 text-[0.8rem]">
                  Vợ / Chồng
                </Label>
                <Select
                  value={form.spouseId || "none"}
                  onValueChange={(v) =>
                    handleChange("spouseId", v === "none" ? "" : v)
                  }
                >
                  <SelectTrigger className="h-10 rounded-xl">
                    <SelectValue placeholder="-- Không --" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-- Không --</SelectItem>
                    {potentialSpouses.map((m) => (
                      <SelectItem key={m.id} value={String(m.id)}>
                        {m.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default function MemberForm({
  open,
  onClose,
  editMember,
  embedded = false,
}: MemberFormProps) {
  const [openCount, setOpenCount] = useState(0);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setOpenCount((c) => c + 1);
    }
  }

  const formKey = editMember ? editMember.id : `new-member-${openCount}`;

  if (embedded) {
    return (
      <MemberFormInner
        key={formKey}
        onClose={onClose}
        editMember={editMember}
        embedded={true}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="sm:max-w-4xl rounded-3xl p-0 overflow-hidden gap-0 max-h-[90vh]"
        showCloseButton={false}
      >
        <MemberFormInner
          key={formKey}
          onClose={onClose}
          editMember={editMember}
        />
      </DialogContent>
    </Dialog>
  );
}
