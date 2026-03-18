import { useMemo, useState } from "react";
import { CalendarDays, Clock3, MapPin, Search } from "lucide-react";
import dayjs, { type Dayjs } from "dayjs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import { useFamily } from "@/context/useFamily";
import { paths } from "@/router/paths";
import {
  memberEventMocks,
  type MemberEventMock,
  type MemberEventType,
} from "@/mocks/memberEvents";

interface EventRow extends MemberEventMock {
  memberName: string;
  memberAvatar: string | null;
  memberInitial: string;
}

interface UpcomingEvent extends EventRow {
  nextDate: Dayjs;
  daysLeft: number;
}

interface YearGroup {
  year: string;
  items: EventRow[];
}

const EVENT_LABELS: Record<MemberEventType, string> = {
  birth: "Chào đời",
  marriage: "Kết hôn",
  education: "Học vấn",
  career: "Công việc",
  achievement: "Thành tích",
  memorial: "Tưởng nhớ",
};

const EVENT_COLORS: Record<MemberEventType, string> = {
  birth: "bg-sky-50 text-sky-700 border-sky-200",
  marriage: "bg-rose-50 text-rose-700 border-rose-200",
  education: "bg-emerald-50 text-emerald-700 border-emerald-200",
  career: "bg-amber-50 text-amber-700 border-amber-200",
  achievement: "bg-lime-50 text-lime-700 border-lime-200",
  memorial: "bg-slate-100 text-slate-700 border-slate-300",
};

const RECURRING_TYPES: MemberEventType[] = ["birth", "marriage", "memorial"];

function isRecurringEvent(type: MemberEventType) {
  return RECURRING_TYPES.includes(type);
}

function getNextOccurrence(event: EventRow, fromDate: Dayjs): Dayjs | null {
  const base = dayjs(event.date);

  if (!base.isValid()) {
    return null;
  }

  if (isRecurringEvent(event.type)) {
    let next = fromDate.month(base.month()).date(base.date()).startOf("day");
    if (next.isBefore(fromDate.startOf("day"))) {
      next = next.add(1, "year");
    }
    return next;
  }

  if (base.isBefore(fromDate.startOf("day"))) {
    return null;
  }

  return base.startOf("day");
}

export default function EventsPage() {
  const { members } = useFamily();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<MemberEventType | "all">("all");

  const rows = useMemo<EventRow[]>(() => {
    const memberMap = new Map(
      members.map((m) => [
        m.id,
        {
          name: m.name,
          avatar: m.avatar,
        },
      ]),
    );

    return memberEventMocks
      .map((event) => ({
        ...event,
        memberName:
          memberMap.get(event.memberId)?.name ??
          `Thành viên #${event.memberId}`,
        memberAvatar: memberMap.get(event.memberId)?.avatar ?? null,
        memberInitial: (memberMap.get(event.memberId)?.name ?? "?")
          .charAt(0)
          .toUpperCase(),
      }))
      .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
  }, [members]);

  const filtered = useMemo(() => {
    return rows.filter((event) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        event.title.toLowerCase().includes(q) ||
        event.memberName.toLowerCase().includes(q) ||
        (event.location ?? "").toLowerCase().includes(q) ||
        (event.note ?? "").toLowerCase().includes(q);

      const matchType = typeFilter === "all" || event.type === typeFilter;

      return matchSearch && matchType;
    });
  }, [rows, search, typeFilter]);

  const upcomingEvents = useMemo<UpcomingEvent[]>(() => {
    const today = dayjs().startOf("day");
    const maxDays = 30;

    return rows
      .map((event) => {
        const nextDate = getNextOccurrence(event, today);
        if (!nextDate) {
          return null;
        }

        const daysLeft = nextDate.diff(today, "day");
        if (daysLeft < 0 || daysLeft > maxDays) {
          return null;
        }

        return {
          ...event,
          nextDate,
          daysLeft,
        };
      })
      .filter((item): item is UpcomingEvent => !!item)
      .sort((a, b) => a.nextDate.valueOf() - b.nextDate.valueOf())
      .slice(0, 8);
  }, [rows]);

  const groups = useMemo<YearGroup[]>(() => {
    const map = new Map<string, EventRow[]>();
    filtered.forEach((item) => {
      const key = dayjs(item.date).isValid()
        ? dayjs(item.date).format("YYYY")
        : "Khac";
      const arr = map.get(key) ?? [];
      arr.push(item);
      map.set(key, arr);
    });

    return Array.from(map.entries())
      .sort((a, b) => Number(b[0]) - Number(a[0]))
      .map(([year, items]) => ({
        year,
        items: items.sort(
          (a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf(),
        ),
      }));
  }, [filtered]);

  const hasFilters = search.trim().length > 0 || typeFilter !== "all";

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8 animate-[fadeIn_0.4s_ease]">
      <PageBreadcrumb
        items={[{ title: "Trang chủ", link: paths.home }, { title: "Sự kiện" }]}
      />

      <Card className="mb-6 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)]">
        <div className="h-28 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.35),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(244,114,182,0.24),transparent_45%),linear-gradient(120deg,#f8fafc,#eef2ff)]" />
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <h1 className="text-[1.65rem] font-bold leading-tight text-slate-900 sm:text-[1.95rem]">
                Family Timeline
              </h1>
              <p className="mt-1 max-w-3xl text-sm text-slate-600 sm:text-base">
                Bảng tin cột mốc gia đình theo phong cách mạng xã hội: dễ đọc,
                dễ tìm, và nổi bật những khoảnh khắc quan trọng qua thời gian.
              </p>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1.5">
                <span className="text-xs text-sky-700 sm:text-sm">
                  {filtered.length} sự kiện đang hiển thị trong dòng thời gian
                </span>
              </div>
            </div>
            <div className="min-w-60 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3">
              <p className="text-xs uppercase tracking-wide text-amber-700">
                Sắp Tới
              </p>
              <p className="mt-0.5 text-lg font-semibold text-slate-900">
                {upcomingEvents.length} sự kiện trong 30 ngày
              </p>
              <p className="mt-1 text-xs text-slate-600">
                Gia đình luôn được kết nối qua kỷ niệm.
              </p>
            </div>
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
                placeholder="Tìm sự kiện, tên thành viên, địa điểm..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 border-slate-200 pl-8"
              />
            </div>

            <Select
              value={typeFilter}
              onValueChange={(value) =>
                setTypeFilter(value as MemberEventType | "all")
              }
            >
              <SelectTrigger className="h-9 w-full border-slate-200 sm:w-60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại sự kiện</SelectItem>
                {Object.entries(EVENT_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasFilters && (
              <Badge
                variant="outline"
                className="rounded-full border-slate-300 bg-slate-100 text-slate-700"
              >
                Đang áp dụng bộ lọc
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <Card className="rounded-3xl border border-slate-200/80 bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-slate-900">
                Tổng quan timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Tổng sự kiện
                </p>
                <p className="mt-0.5 text-xl font-semibold text-slate-900">
                  {rows.length}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Sau lọc
                </p>
                <p className="mt-0.5 text-xl font-semibold text-slate-900">
                  {filtered.length}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Năm trải dài
                </p>
                <p className="mt-0.5 text-xl font-semibold text-slate-900">
                  {groups.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-amber-200 bg-amber-50/70 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-amber-900">
                Sự kiện sắp tới
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <p className="py-8 text-center text-sm text-amber-700/80">
                  Chưa có sự kiện sắp tới
                </p>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <div
                      key={`upcoming-${event.id}`}
                      className="rounded-2xl border border-amber-200 bg-white/90 p-3"
                    >
                      <p className="text-sm font-semibold text-slate-900">
                        {event.title}
                      </p>
                      <p className="mt-1 text-xs text-slate-600">
                        {event.memberName} •{" "}
                        {event.nextDate.format("DD/MM/YYYY")}
                      </p>
                      <p className="mt-1 text-xs font-medium text-amber-700">
                        {event.daysLeft === 0
                          ? "Hôm nay"
                          : event.daysLeft === 1
                            ? "Còn 1 ngày"
                            : `Còn ${event.daysLeft} ngày`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-5">
          {groups.length === 0 ? (
            <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
              <CardContent className="py-20 text-center text-slate-400">
                Không tìm thấy sự kiện phù hợp
              </CardContent>
            </Card>
          ) : (
            groups.map((group) => (
              <section key={group.year} className="space-y-3">
                <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold tracking-wide text-slate-600 shadow-sm">
                  Năm {group.year}
                </div>

                <div className="relative space-y-4 pl-7">
                  <div className="absolute bottom-0 left-3 top-0 w-0.5 rounded-full bg-linear-to-b from-sky-300 via-slate-300 to-rose-300" />

                  {group.items.map((event) => (
                    <article key={`timeline-${event.id}`} className="relative">
                      <span className="absolute -left-4 top-7 z-10 size-3 rounded-full border-2 border-white bg-slate-500 shadow" />

                      <Card className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.07)] transition-transform duration-200 hover:-translate-y-0.5">
                        <CardContent className="p-4 sm:p-5">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <Avatar className="size-11 border border-slate-200">
                                {event.memberAvatar && (
                                  <AvatarImage
                                    src={event.memberAvatar}
                                    alt={event.memberName}
                                  />
                                )}
                                <AvatarFallback>
                                  {event.memberInitial}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-900 sm:text-base">
                                  {event.memberName}
                                </p>
                                <p className="text-xs text-slate-500">
                                  đã thêm một cột mốc
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant="outline"
                              className={`rounded-full font-medium ${EVENT_COLORS[event.type]}`}
                            >
                              {EVENT_LABELS[event.type]}
                            </Badge>
                          </div>

                          <h3 className="mt-4 text-lg font-semibold text-slate-900 sm:text-xl">
                            {event.title}
                          </h3>

                          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays
                                size={15}
                                className="text-slate-500"
                              />
                              {dayjs(event.date).format("DD/MM/YYYY")}
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                              <MapPin size={15} className="text-slate-500" />
                              {event.location || "Địa điểm đang cập nhật"}
                            </span>
                          </div>

                          {event.image && (
                            <img
                              src={event.image}
                              alt={event.title}
                              className="mt-3 h-48 w-full rounded-2xl object-cover sm:h-64"
                              loading="lazy"
                            />
                          )}

                          {event.note && (
                            <p className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                              {event.note}
                            </p>
                          )}

                          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                            <span className="inline-flex items-center gap-1">
                              <Clock3 size={14} />
                              Đăng trong dòng thời gian gia đình
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </article>
                  ))}
                </div>
              </section>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
