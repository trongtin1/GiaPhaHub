import { useNavigate } from "react-router-dom";
import { User, Pencil, Trash2, Eye } from "lucide-react";
import { Tooltip, Button, Tag } from "antd";
import { useFamilyId } from "@/hooks/useFamilyId";
import { paths } from "@/router/paths";
import type { FamilyMember } from "@/types";

interface Props {
  members: FamilyMember[];
  onEdit: (m: FamilyMember) => void;
  onDelete: (m: FamilyMember) => void;
}

export default function GenerationGrid({ members, onEdit, onDelete }: Props) {
  const navigate = useNavigate();
  const familyId = useFamilyId();

  const byGen = members.reduce<Record<number, FamilyMember[]>>((acc, m) => {
    (acc[m.generation] ??= []).push(m);
    return acc;
  }, {});

  const generations = Object.keys(byGen)
    .map(Number)
    .sort((a, b) => a - b);

  if (generations.length === 0)
    return (
      <div className="flex items-center justify-center py-16 text-gray-400 italic">
        Không tìm thấy thành viên nào
      </div>
    );

  const genColors: Record<number, string> = {
    1: "gold",
    2: "orange",
    3: "cyan",
    4: "blue",
    5: "green",
    6: "purple",
  };

  return (
    <div className="flex flex-col gap-8">
      {generations.map((gen) => (
        <section key={gen}>
          {/* Generation header */}
          <div className="flex items-center gap-3 mb-4">
            <Tag
              color={genColors[gen] ?? "default"}
              style={{ fontSize: 13, padding: "3px 12px" }}
            >
              Đời {gen}
            </Tag>
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">
              {byGen[gen].length} thành viên
            </span>
          </div>

          {/* Member cards */}
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
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
                  <Tag color="red" style={{ fontSize: 10 }}>
                    Đã mất
                  </Tag>
                )}

                {/* Actions */}
                <div
                  className="flex gap-1 mt-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Tooltip title="Xem chi tiết">
                    <Button
                      type="text"
                      size="small"
                      icon={<Eye size={14} />}
                      onClick={() => navigate(paths.member(familyId, m.id))}
                    />
                  </Tooltip>
                  <Tooltip title="Chỉnh sửa">
                    <Button
                      type="text"
                      size="small"
                      icon={<Pencil size={14} />}
                      onClick={() => onEdit(m)}
                    />
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <Button
                      type="text"
                      size="small"
                      danger
                      icon={<Trash2 size={14} />}
                      onClick={() => onDelete(m)}
                    />
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
