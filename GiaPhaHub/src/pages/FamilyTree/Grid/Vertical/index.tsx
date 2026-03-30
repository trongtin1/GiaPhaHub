import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Pencil, Trash2, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DiagramHeader from "@/pages/FamilyTree/components/DiagramHeader";
import { useFamily } from "@/context/useFamily";
import { useFamilyId } from "@/hooks/useFamilyId";
import { paths } from "@/router/paths";
import type { FamilyMemberResponse } from "@/models/FamilyMember";

const genColorCls: Record<number, string> = {
  1: "bg-amber-100 text-amber-700 border-amber-200",
  2: "bg-orange-100 text-orange-700 border-orange-200",
  3: "bg-cyan-100 text-cyan-700 border-cyan-200",
  4: "bg-blue-100 text-blue-700 border-blue-200",
  5: "bg-green-100 text-green-700 border-green-200",
  6: "bg-purple-100 text-purple-700 border-purple-200",
};

const defaultGenCls = "bg-gray-100 text-gray-700 border-gray-200";

export default function FamilyGrid() {
  const navigate = useNavigate();
  const familyId = useFamilyId();
  const { members, deleteMember, loadMembers } = useFamily();

  const [deleteConfirm, setDeleteConfirm] =
    useState<FamilyMemberResponse | null>(null);

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteMember(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const byGen = members.reduce<Record<number, FamilyMemberResponse[]>>(
    (acc, m) => {
      (acc[m.generation] ??= []).push(m);
      return acc;
    },
    {},
  );

  const generations = Object.keys(byGen)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-[fadeIn_0.4s_ease]">
      <DiagramHeader
        title="Lưới Thế Hệ"
        description={`${members.length} thành viên trong gia phả`}
      />

      <TooltipProvider>
        <div className="flex flex-col gap-8">
          {generations.length === 0 ? (
            <div className="flex items-center justify-center py-16 text-gray-400 italic">
              Không tìm thấy thành viên nào
            </div>
          ) : (
            generations.map((gen) => (
              <section key={gen}>
                {/* Generation header */}
                <div className="flex items-center gap-3 mb-4">
                  <Badge
                    variant="outline"
                    className={`text-xs px-3 py-0.5 ${genColorCls[gen] ?? defaultGenCls}`}
                  >
                    Đời {gen}
                  </Badge>
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400">
                    {byGen[gen].length} thành viên
                  </span>
                </div>

                {/* Member cards */}
                <div
                  className="grid gap-3"
                  style={{
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(190px, 1fr))",
                  }}
                >
                  {byGen[gen].map((m) => (
                    <div
                      key={m.id}
                      className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md cursor-pointer ${
                        m.gender === "male"
                          ? "border-blue-100 hover:border-blue-300"
                          : "border-pink-100 hover:border-pink-300"
                      } ${m.deathDate ? "opacity-60" : ""}`}
                      onClick={() => navigate(paths.member(familyId, m.id))}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                          m.gender === "male"
                            ? "bg-blue-50 text-blue-500 border-blue-100"
                            : "bg-pink-50 text-pink-500 border-pink-100"
                        }`}
                      >
                        <User size={22} />
                      </div>

                      {/* Name */}
                      <span className="text-sm font-semibold text-gray-900 text-center leading-tight">
                        {m.name}
                      </span>

                      {/* Year */}
                      {m.birthDate && (
                        <span className="text-xs text-gray-400">
                          {m.birthDate.slice(0, 4)}
                          {m.deathDate && ` – ${m.deathDate.slice(0, 4)}`}
                        </span>
                      )}

                      {m.deathDate && (
                        <Badge
                          variant="destructive"
                          className="text-[10px] px-2 py-0"
                        >
                          Đã mất
                        </Badge>
                      )}

                      {/* Actions */}
                      <div
                        className="flex gap-1 mt-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() =>
                                navigate(paths.member(familyId, m.id))
                              }
                            >
                              <Eye size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Xem chi tiết</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <Pencil size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Chỉnh sửa</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Xóa</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </TooltipProvider>

      <Dialog
        open={!!deleteConfirm}
        onOpenChange={(v) => !v && setDeleteConfirm(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa thành viên</DialogTitle>
            <DialogDescription>
              Bạn có chắc muốn xóa <strong>{deleteConfirm?.name}</strong> khỏi
              gia phả? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
