import { useMemo, useState } from "react";
import {
  Badge,
  Calendar,
  Card,
  DatePicker,
  Empty,
  Input,
  Select,
  Segmented,
  Table,
  Tag,
  Timeline,
} from "antd";
import type { TableColumnsType } from "antd";
import dayjs, { type Dayjs } from "dayjs";
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
}

interface UpcomingEvent extends EventRow {
  nextDate: Dayjs;
  daysLeft: number;
}

const EVENT_LABELS: Record<MemberEventType, string> = {
  birth: "Chao doi",
  marriage: "Ket hon",
  education: "Hoc van",
  career: "Cong viec",
  achievement: "Thanh tich",
  memorial: "Tuong nho",
};

const EVENT_COLORS: Record<MemberEventType, string> = {
  birth: "blue",
  marriage: "magenta",
  education: "cyan",
  career: "gold",
  achievement: "green",
  memorial: "red",
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

function eventOccursOnDate(event: EventRow, date: Dayjs): boolean {
  const target = date.startOf("day");
  const base = dayjs(event.date).startOf("day");

  if (!base.isValid()) {
    return false;
  }

  if (isRecurringEvent(event.type)) {
    return target.date() === base.date() && target.month() === base.month();
  }

  return target.isSame(base, "day");
}

export default function EventsPage() {
  const { members } = useFamily();
  const [viewMode, setViewMode] = useState<"table" | "calendar" | "timeline">(
    "table",
  );
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
  const [search, setSearch] = useState("");
  const [memberFilter, setMemberFilter] = useState<number | undefined>(
    undefined,
  );
  const [typeFilter, setTypeFilter] = useState<MemberEventType | undefined>(
    undefined,
  );
  const [yearFilter, setYearFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<
    [Dayjs | null, Dayjs | null] | null
  >(null);

  const rows = useMemo<EventRow[]>(() => {
    const memberMap = new Map(members.map((m) => [m.id, m.name]));

    return memberEventMocks
      .map((event) => ({
        ...event,
        memberName:
          memberMap.get(event.memberId) ?? `Thanh vien #${event.memberId}`,
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
        (event.note ?? "").toLowerCase().includes(q);

      const matchMember = !memberFilter || event.memberId === memberFilter;
      const matchType = !typeFilter || event.type === typeFilter;
      const matchYear =
        !yearFilter || dayjs(event.date).format("YYYY") === yearFilter;
      const eventDate = dayjs(event.date);
      const [fromDate, toDate] = dateRange ?? [null, null];
      const matchDateRange =
        eventDate.isValid() &&
        (!fromDate || !eventDate.isBefore(fromDate.startOf("day"))) &&
        (!toDate || !eventDate.isAfter(toDate.endOf("day")));

      return (
        matchSearch && matchMember && matchType && matchYear && matchDateRange
      );
    });
  }, [rows, search, memberFilter, typeFilter, yearFilter, dateRange]);

  const years = useMemo(() => {
    return Array.from(
      new Set(rows.map((event) => dayjs(event.date).format("YYYY"))),
    ).sort((a, b) => Number(b) - Number(a));
  }, [rows]);

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

  const selectedDateEvents = useMemo(() => {
    return filtered
      .filter((event) => eventOccursOnDate(event, selectedDate))
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [filtered, selectedDate]);

  const getEventsInDateCell = (date: Dayjs) => {
    return filtered.filter((event) => eventOccursOnDate(event, date));
  };

  const columns: TableColumnsType<EventRow> = [
    {
      title: "Ngay",
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (value: string) => dayjs(value).format("DD/MM/YYYY"),
    },
    {
      title: "Thanh vien",
      dataIndex: "memberName",
      key: "memberName",
      width: 220,
      render: (value: string) => (
        <span className="font-medium text-gray-900">{value}</span>
      ),
    },
    {
      title: "Loai su kien",
      dataIndex: "type",
      key: "type",
      width: 150,
      render: (value: MemberEventType) => (
        <Tag color={EVENT_COLORS[value]}>{EVENT_LABELS[value]}</Tag>
      ),
    },
    {
      title: "Noi dung",
      dataIndex: "title",
      key: "title",
      render: (_: string, record) => (
        <div>
          <div className="font-medium text-gray-900">{record.title}</div>
          {record.note && (
            <div className="text-xs text-gray-500 mt-0.5">{record.note}</div>
          )}
        </div>
      ),
    },
    {
      title: "Dia diem",
      dataIndex: "location",
      key: "location",
      width: 190,
      render: (value?: string) => (
        <span className="text-gray-500">{value || "-"}</span>
      ),
    },
  ];

  return (
    <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-[fadeIn_0.4s_ease]">
      <PageBreadcrumb
        items={[{ title: "Trang chu", link: paths.home }, { title: "Su kien" }]}
      />

      <div className="flex items-center justify-between mb-7 flex-wrap gap-4 max-md:flex-col max-md:items-stretch">
        <div>
          <h1 className="text-[1.75rem] font-bold bg-linear-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            Su Kien Thanh Vien
          </h1>
          <p className="text-sm mt-0.5 text-gray-500">
            {filtered.length} / {rows.length} su kien
          </p>
        </div>
        <Segmented
          value={viewMode}
          onChange={(v) => setViewMode(v as "table" | "calendar" | "timeline")}
          options={[
            { value: "table", label: "Bang" },
            { value: "calendar", label: "Calendar" },
            { value: "timeline", label: "Timeline" },
          ]}
        />
      </div>

      <Card className="rounded-2xl shadow-sm border border-amber-100 mb-5">
        <h3 className="text-base font-semibold text-gray-900 mb-3">
          Thong bao su kien sap toi (30 ngay)
        </h3>
        {upcomingEvents.length === 0 ? (
          <Empty
            description="Khong co su kien sap toi trong 30 ngay"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {upcomingEvents.map((event) => (
              <div
                key={`upcoming-${event.id}`}
                className="rounded-xl border border-amber-100 bg-amber-50/40 px-3 py-2"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-gray-900">
                    {event.title}
                  </span>
                  <Tag color={EVENT_COLORS[event.type]}>
                    {EVENT_LABELS[event.type]}
                  </Tag>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {event.memberName} - {event.nextDate.format("DD/MM/YYYY")}
                </div>
                <div className="text-xs text-amber-700 mt-1">
                  {event.daysLeft === 0
                    ? "Hom nay"
                    : event.daysLeft === 1
                      ? "Con 1 ngay"
                      : `Con ${event.daysLeft} ngay`}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="rounded-2xl shadow-sm border border-gray-100">
        <div className="flex gap-3 mb-5 flex-wrap max-md:flex-col">
          <Input.Search
            placeholder="Tim theo ten thanh vien, noi dung..."
            allowClear
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onSearch={setSearch}
            className="flex-1 min-w-60"
          />

          <Select
            value={memberFilter}
            onChange={(value) => setMemberFilter(value)}
            allowClear
            placeholder="Tat ca thanh vien"
            style={{ minWidth: 190 }}
            options={members.map((member) => ({
              value: member.id,
              label: member.name,
            }))}
            showSearch
          />

          <Select
            value={typeFilter}
            onChange={(value) => setTypeFilter(value)}
            allowClear
            placeholder="Tat ca loai su kien"
            style={{ minWidth: 180 }}
            options={Object.entries(EVENT_LABELS).map(([value, label]) => ({
              value,
              label,
            }))}
          />

          <Select
            value={yearFilter || undefined}
            onChange={(value) => setYearFilter(value ?? "")}
            allowClear
            placeholder="Tat ca nam"
            showSearch
            style={{ minWidth: 140 }}
            options={years.map((year) => ({ value: year, label: year }))}
          />

          <DatePicker.RangePicker
            value={dateRange}
            onChange={(values) => setDateRange(values)}
            allowClear
            format="DD/MM/YYYY"
            placeholder={["Tu ngay", "Den ngay"]}
            style={{ minWidth: 280 }}
          />
        </div>

        {viewMode === "table" ? (
          <Table
            rowKey="id"
            columns={columns}
            dataSource={filtered}
            size="middle"
            pagination={{ pageSize: 8, showSizeChanger: false }}
            locale={{
              emptyText: (
                <Empty
                  description="Khong co su kien phu hop"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ),
            }}
          />
        ) : viewMode === "calendar" ? (
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-5">
            <Calendar
              value={selectedDate}
              onSelect={(value) => setSelectedDate(value)}
              dateCellRender={(value) => {
                const items = getEventsInDateCell(value);
                if (items.length === 0) {
                  return null;
                }

                return (
                  <ul className="m-0 p-0 list-none space-y-1">
                    {items.slice(0, 2).map((item) => (
                      <li key={`${value.format("YYYYMMDD")}-${item.id}`}>
                        <Badge
                          color={
                            item.type === "birth"
                              ? "blue"
                              : item.type === "marriage"
                                ? "magenta"
                                : item.type === "education"
                                  ? "cyan"
                                  : item.type === "career"
                                    ? "gold"
                                    : item.type === "achievement"
                                      ? "green"
                                      : "red"
                          }
                          text={
                            <span className="text-[11px]">
                              {item.memberName}
                            </span>
                          }
                        />
                      </li>
                    ))}
                    {items.length > 2 && (
                      <li className="text-[11px] text-gray-400">
                        +{items.length - 2} su kien
                      </li>
                    )}
                  </ul>
                );
              }}
            />

            <Card
              size="small"
              title={`Ngay ${selectedDate.format("DD/MM/YYYY")}`}
              className="h-fit"
            >
              {selectedDateEvents.length === 0 ? (
                <Empty
                  description="Khong co su kien trong ngay nay"
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              ) : (
                <div className="space-y-3">
                  {selectedDateEvents.map((event) => (
                    <div
                      key={`day-${event.id}`}
                      className="rounded-lg border border-gray-200 p-3"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="font-medium text-gray-900">
                          {event.title}
                        </span>
                        <Tag color={EVENT_COLORS[event.type]}>
                          {EVENT_LABELS[event.type]}
                        </Tag>
                      </div>
                      <div className="text-sm text-gray-600">
                        {event.memberName}
                      </div>
                      {event.location && (
                        <div className="text-xs text-gray-500 mt-1">
                          Dia diem: {event.location}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        ) : filtered.length === 0 ? (
          <Empty
            description="Khong co su kien phu hop"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <Timeline
            mode="left"
            items={filtered.map((event) => ({
              color: EVENT_COLORS[event.type],
              label: (
                <span className="text-xs text-gray-500 font-medium">
                  {dayjs(event.date).format("DD/MM/YYYY")}
                </span>
              ),
              children: (
                <div className="pb-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900">
                      {event.title}
                    </span>
                    <Tag color={EVENT_COLORS[event.type]}>
                      {EVENT_LABELS[event.type]}
                    </Tag>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {event.memberName}
                  </p>
                  {event.location && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      Dia diem: {event.location}
                    </p>
                  )}
                  {event.note && (
                    <p className="text-sm text-gray-600 mt-1">{event.note}</p>
                  )}
                </div>
              ),
            }))}
          />
        )}
      </Card>
    </div>
  );
}
