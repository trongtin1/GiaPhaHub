import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { useFamily } from "@/context/useFamily";
import MemberForm from "@/components/MemberForm";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import { useFamilyId } from "@/hooks/useFamilyId";
import { paths } from "@/router/paths";
import dayjs from "dayjs";

const PAGE_SIZE = 15;

export default function Members() {
  const { members } = useFamily();
  const navigate = useNavigate();
  const familyId = useFamilyId();
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterGen, setFilterGen] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [page, setPage] = useState(1);

  const generations = [...new Set(members.map((m) => m.generation))].sort();

  const filtered = useMemo(
    () =>
      members.filter((m) => {
        const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
        const matchGender = !filterGender || m.gender === filterGender;
        const matchGen = !filterGen || m.generation === Number(filterGen);
        return matchSearch && matchGender && matchGen;
      }),
    [members, search, filterGender, filterGen],
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleAdd = () => {
    setFormOpen(true);
  };

  const hasFilters = search.trim().length > 0 || !!filterGender || !!filterGen;

  return (
    <div className="mx-auto max-w-7xl animate-[fadeIn_0.4s_ease] px-4 py-7 sm:px-6 sm:py-8 lg:px-8">
      <PageBreadcrumb
        items={[
          { title: "Trang chủ", link: paths.home },
          { title: "Thành viên" },
        ]}
      />

      <Card className="mb-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
        <div className="h-28 bg-[radial-gradient(circle_at_15%_20%,rgba(251,191,36,0.36),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(249,115,22,0.2),transparent_45%),linear-gradient(120deg,#fff7ed,#fffbeb)]" />
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <h1 className="text-[1.65rem] font-bold leading-tight text-slate-900 sm:text-[1.95rem]">
                Family Members Feed
              </h1>
              <p className="mt-1 max-w-3xl text-sm text-slate-600 sm:text-base">
                Danh sách thành viên theo dạng card hiện đại, dễ theo dõi thông
                tin và thao tác nhanh như một bảng tin.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5">
                <span className="text-xs text-amber-700 sm:text-sm">
                  {filtered.length} thành viên đang hiển thị
                </span>
              </div>
            </div>
            <Button
              className="h-10 rounded-xl bg-linear-to-r from-amber-500 to-orange-600 px-5 text-sm font-semibold text-white shadow-sm hover:-translate-y-px"
              onClick={handleAdd}
            >
              <Plus size={16} /> Thêm thành viên
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-5 rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full sm:min-w-72 sm:flex-1">
              <Search
                size={16}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                placeholder="Tìm theo tên thành viên..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="h-9 border-slate-200 pl-8"
              />
            </div>

            <Select
              value={filterGender || "all"}
              onValueChange={(v) => {
                setFilterGender(v === "all" ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-full border-slate-200 sm:w-44">
                <SelectValue placeholder="Tất cả giới tính" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả giới tính</SelectItem>
                <SelectItem value="male">Nam</SelectItem>
                <SelectItem value="female">Nữ</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterGen || "all"}
              onValueChange={(v) => {
                setFilterGen(v === "all" ? "" : v);
                setPage(1);
              }}
            >
              <SelectTrigger className="h-9 w-full border-slate-200 sm:w-44">
                <SelectValue placeholder="Tất cả thế hệ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thế hệ</SelectItem>
                {generations.map((g) => (
                  <SelectItem key={g} value={String(g)}>
                    Đời {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasFilters && (
              <Badge
                variant="outline"
                className="rounded-full border-slate-300 bg-slate-100 text-slate-700"
              >
                Đang lọc
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {paged.length === 0 ? (
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <CardContent className="py-20 text-center text-slate-400">
            Không tìm thấy thành viên phù hợp
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {paged.map((member) => {
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

            return (
              <Card
                key={member.id}
                className={`overflow-hidden rounded-3xl border bg-white shadow-[0_10px_30px_rgba(15,23,42,0.07)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(15,23,42,0.1)] cursor-pointer ${member.deathDate ? "border-slate-300/80 opacity-85" : "border-slate-200/90"}`}
                onClick={() => navigate(paths.member(familyId, member.id))}
              >
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar className="size-12 border border-slate-200">
                        {member.avatar && (
                          <AvatarImage src={member.avatar} alt={member.name} />
                        )}
                        <AvatarFallback>
                          {member.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate text-base font-semibold text-slate-900">
                          {member.name}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          Hồ sơ thành viên gia đình
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center justify-end gap-1.5">
                      <Badge
                        variant="outline"
                        className={`rounded-full ${isMale ? "border-sky-200 bg-sky-50 text-sky-700" : "border-rose-200 bg-rose-50 text-rose-700"}`}
                      >
                        {isMale ? "Nam" : "Nữ"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="rounded-full border-amber-200 bg-amber-50 text-amber-700"
                      >
                        Đời {member.generation}
                      </Badge>
                      {member.deathDate && (
                        <Badge className="rounded-full bg-slate-600 text-white">
                          Đã mất
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays size={15} className="text-slate-500" />
                      {member.birthDate
                        ? dayjs(member.birthDate).format("DD/MM/YYYY")
                        : "Chưa có ngày sinh"}
                      {age !== null && ` • ${age} tuổi`}
                    </span>
                    {member.address && (
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={15} className="text-slate-500" />
                        {member.address}
                      </span>
                    )}
                    {member.phone && (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone size={15} className="text-slate-500" />
                        {member.phone}
                      </span>
                    )}
                  </div>

                  {member.bio && (
                    <p className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700 line-clamp-2">
                      {member.bio}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                      <Users size={13} />
                      Mã thành viên #{member.id}
                    </span>
                    <span className="text-xs font-medium text-slate-600">
                      Nhấn vào card để xem chi tiết
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-5 flex items-center justify-between">
          <p className="text-xs text-slate-500">
            Hiển thị {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, filtered.length)} / {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft size={14} />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                variant={p === page ? "default" : "outline"}
                size="sm"
                onClick={() => setPage(p)}
                className="min-w-8"
              >
                {p}
              </Button>
            ))}
            <Button
              variant="outline"
              size="icon-sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}

      <MemberForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
        }}
        editMember={null}
      />
    </div>
  );
}
