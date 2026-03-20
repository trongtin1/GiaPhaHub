import { useMemo, useState, useEffect } from "react";
import { CalendarDays, MapPin, Search, Users } from "lucide-react";
import dayjs from "dayjs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import { useFamily } from "@/context/useFamily";
import { paths } from "@/router/paths";
import { familyPhotoMocks, type FamilyPhotoItem } from "@/mocks/familyPhotos";

type SortValue = "newest" | "oldest";

export default function GalleryPage() {
  const { members, loadMembers } = useFamily();

  useEffect(() => {
    loadMembers();
  }, [loadMembers]);
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState<SortValue>("newest");
  const [memberFilter, setMemberFilter] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<string>("");
  const [activePhoto, setActivePhoto] = useState<FamilyPhotoItem | null>(null);

  const memberMap = useMemo(
    () => new Map(members.map((member) => [member.id, member.name])),
    [members],
  );

  const allTags = useMemo(
    () =>
      Array.from(new Set(familyPhotoMocks.flatMap((item) => item.tags))).sort(),
    [],
  );

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();

    return familyPhotoMocks
      .filter((item) => {
        const memberNames = item.memberIds
          .map((memberId) => memberMap.get(memberId) ?? `TV #${memberId}`)
          .join(" ")
          .toLowerCase();

        const matchSearch =
          !q ||
          item.title.toLowerCase().includes(q) ||
          (item.description ?? "").toLowerCase().includes(q) ||
          (item.location ?? "").toLowerCase().includes(q) ||
          item.tags.some((tag) => tag.includes(q)) ||
          memberNames.includes(q);

        const matchMember =
          !memberFilter || item.memberIds.includes(Number(memberFilter));
        const matchTag = !tagFilter || item.tags.includes(tagFilter);

        return matchSearch && matchMember && matchTag;
      })
      .sort((a, b) => {
        const delta =
          dayjs(a.capturedAt).valueOf() - dayjs(b.capturedAt).valueOf();
        return sortBy === "oldest" ? delta : -delta;
      });
  }, [keyword, memberFilter, tagFilter, memberMap, sortBy]);

  const segmentBtnCls = (active: boolean) =>
    `cursor-pointer rounded-lg border-none px-3 py-1.5 text-xs font-medium transition-all ${
      active
        ? "bg-sky-100 text-sky-700 shadow-sm"
        : "bg-slate-100 text-slate-500 hover:bg-slate-200"
    }`;

  return (
    <div className="mx-auto max-w-7xl animate-[fadeIn_0.4s_ease] px-4 py-7 sm:px-6 sm:py-8 lg:px-8">
      <PageBreadcrumb
        items={[
          { title: "Trang chủ", link: paths.home },
          { title: "Thư viện ảnh" },
        ]}
      />

      <Card className="mb-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
        <div className="h-28 bg-[radial-gradient(circle_at_15%_20%,rgba(56,189,248,0.32),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(251,191,36,0.25),transparent_45%),linear-gradient(120deg,#f8fafc,#fefce8)]" />
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <h1 className="text-[1.65rem] font-bold leading-tight text-slate-900 sm:text-[1.95rem]">
                Family Photo Feed
              </h1>
              <p className="mt-1 max-w-3xl text-sm text-slate-600 sm:text-base">
                Dòng ảnh kỷ niệm theo phong cách feed hiện đại: dễ lướt, dễ lọc,
                và nổi bật thông tin thời gian, địa điểm, thành viên.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5">
                <span className="text-xs text-sky-700 sm:text-sm">
                  {filtered.length} ảnh đang hiển thị
                </span>
              </div>
            </div>

            <div className="inline-flex items-center gap-1 rounded-xl bg-slate-100 p-1">
              <button
                className={segmentBtnCls(sortBy === "newest")}
                onClick={() => setSortBy("newest")}
              >
                Mới nhất
              </button>
              <button
                className={segmentBtnCls(sortBy === "oldest")}
                onClick={() => setSortBy("oldest")}
              >
                Cũ nhất
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-5 rounded-3xl border border-slate-200/80 bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <Input
                placeholder="Tìm ảnh theo tên, địa điểm, tag..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="h-9 border-slate-200 pl-8"
              />
            </div>

            <Select
              value={memberFilter || "all"}
              onValueChange={(v) => setMemberFilter(v === "all" ? "" : v)}
            >
              <SelectTrigger className="h-9 border-slate-200">
                <SelectValue placeholder="Lọc theo thành viên" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả thành viên</SelectItem>
                {members.map((member) => (
                  <SelectItem key={member.id} value={String(member.id)}>
                    {member.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={tagFilter || "all"}
              onValueChange={(v) => setTagFilter(v === "all" ? "" : v)}
            >
              <SelectTrigger className="h-9 border-slate-200">
                <SelectValue placeholder="Lọc theo chủ đề" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chủ đề</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag} value={tag}>
                    #{tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
          <CardContent className="py-20 text-center text-slate-400">
            Không có hình ảnh phù hợp với bộ lọc hiện tại
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((photo) => {
            const memberNames = photo.memberIds
              .map((memberId) => memberMap.get(memberId) ?? `TV #${memberId}`)
              .join(", ");

            return (
              <article
                key={photo.id}
                className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.07)] transition-transform duration-200 hover:-translate-y-0.5"
              >
                <button
                  type="button"
                  className="w-full cursor-pointer text-left"
                  onClick={() => setActivePhoto(photo)}
                >
                  <div className="aspect-16/10 overflow-hidden bg-slate-100">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="line-clamp-1 text-base font-semibold text-slate-900 sm:text-lg">
                      {photo.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays size={14} className="text-slate-500" />
                        {dayjs(photo.capturedAt).format("DD/MM/YYYY")}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={14} className="text-slate-500" />
                        {photo.location || "Chưa cập nhật địa điểm"}
                      </span>
                    </div>

                    {photo.description && (
                      <p className="mt-3 line-clamp-2 text-sm text-slate-700">
                        {photo.description}
                      </p>
                    )}

                    <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <Users size={13} />
                      {memberNames}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {photo.tags.slice(0, 4).map((tag) => (
                        <Badge
                          key={`${photo.id}-${tag}`}
                          variant="secondary"
                          className="rounded-full bg-slate-100 text-[11px] text-slate-700"
                        >
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      )}

      <Dialog
        open={!!activePhoto}
        onOpenChange={(v) => !v && setActivePhoto(null)}
      >
        <DialogContent className="sm:max-w-230">
          <DialogHeader>
            <DialogTitle>{activePhoto?.title}</DialogTitle>
          </DialogHeader>
          {activePhoto && (
            <div>
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                className="max-h-[65vh] w-full rounded-2xl object-cover"
              />
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                <p>
                  <strong>Ngày chụp:</strong>{" "}
                  {dayjs(activePhoto.capturedAt).format("DD/MM/YYYY")}
                </p>
                {activePhoto.location && (
                  <p>
                    <strong>Địa điểm:</strong> {activePhoto.location}
                  </p>
                )}
                <p>
                  <strong>Thành viên:</strong>{" "}
                  {activePhoto.memberIds
                    .map(
                      (memberId) =>
                        memberMap.get(memberId) ?? `TV #${memberId}`,
                    )
                    .join(", ")}
                </p>
                {activePhoto.description && (
                  <p>
                    <strong>Mô tả:</strong> {activePhoto.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {activePhoto.tags.map((tag) => (
                    <Badge
                      key={`modal-${activePhoto.id}-${tag}`}
                      variant="secondary"
                      className="text-[11px]"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
