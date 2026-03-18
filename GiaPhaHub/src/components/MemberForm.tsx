import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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

export default function MemberForm({
  open,
  onClose,
  editMember,
}: MemberFormProps) {
  const { members, addMember, updateMember } = useFamily();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);

  useEffect(() => {
    if (open) {
      if (editMember) {
        const parentId = getParentId(editMember);
        const spouseId = getSpouseId(editMember);
        setForm({
          name: editMember.name,
          gender: editMember.gender as "male" | "female",
          birthDate: editMember.birthDate || "",
          deathDate: editMember.deathDate || "",
          phone: editMember.phone || "",
          address: editMember.address || "",
          bio: editMember.bio || "",
          parentId: parentId ? String(parentId) : "",
          spouseId: spouseId ? String(spouseId) : "",
        });
      } else {
        setForm(INITIAL_FORM);
      }
    }
  }, [editMember, open]);

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

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-150">
        <DialogHeader>
          <DialogTitle className="text-base">
            {editMember ? "Chỉnh sửa thành viên" : "Thêm thành viên mới"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">
              Họ và tên <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              placeholder="Nhập họ và tên"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
              className="h-9"
            />
          </div>

          {/* Gender + Birth Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Giới tính</Label>
              <Select
                value={form.gender}
                onValueChange={(v) => handleChange("gender", v)}
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Nam</SelectItem>
                  <SelectItem value="female">Nữ</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="birthDate">Ngày sinh</Label>
              <Input
                id="birthDate"
                type="date"
                value={form.birthDate}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                className="h-9"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="deathDate">Ngày mất</Label>
              <Input
                id="deathDate"
                type="date"
                value={form.deathDate}
                onChange={(e) => handleChange("deathDate", e.target.value)}
                className="h-9"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                placeholder="0901234567"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          {/* Address */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              placeholder="Nhập địa chỉ"
              value={form.address}
              onChange={(e) => handleChange("address", e.target.value)}
              className="h-9"
            />
          </div>

          {/* Parent + Spouse */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label>Cha / Mẹ</Label>
              <Select
                value={form.parentId || "none"}
                onValueChange={(v) =>
                  handleChange("parentId", v === "none" ? "" : v)
                }
              >
                <SelectTrigger className="h-9">
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
              <Label>Vợ / Chồng</Label>
              <Select
                value={form.spouseId || "none"}
                onValueChange={(v) =>
                  handleChange("spouseId", v === "none" ? "" : v)
                }
              >
                <SelectTrigger className="h-9">
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

          {/* Bio */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bio">Tiểu sử</Label>
            <Textarea
              id="bio"
              placeholder="Nhập tiểu sử ngắn..."
              rows={3}
              value={form.bio}
              onChange={(e) => handleChange("bio", e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit">
              {editMember ? "Cập nhật" : "Thêm mới"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
