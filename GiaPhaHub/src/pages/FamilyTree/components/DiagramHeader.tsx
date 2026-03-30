import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Check,
  ChevronsUpDown,
  Filter,
  LocateFixed,
  Minus,
  Plus,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import { useFamilyId } from "@/hooks/useFamilyId";
import { cn } from "@/lib/utils";
import type { FamilyMemberResponse } from "@/models/FamilyMember";
import type { DiagramFilters } from "@/pages/FamilyTree/diagramFilters";
import { paths } from "@/router/paths";
import { DATA_FILTER_ITEMS, DISPLAY_FILTER_ITEMS } from "@/constants/filter";

interface DiagramHeaderControls {
  members: FamilyMemberResponse[];
  selectedRootId: number | null;
  setSelectedRootId: (id: number) => void;
  zoomLevel: number;
  onZoomOut: () => void;
  onZoomIn: () => void;
  onCenterView: () => void;
  filters: DiagramFilters;
  onFilterChange: <K extends keyof DiagramFilters>(
    key: K,
    value: DiagramFilters[K],
  ) => void;
  onRootChanged?: (id: number) => void;
}

interface DiagramHeaderProps {
  title: string;
  description?: string;
  controls?: DiagramHeaderControls;
}

const diagramNav = [
  {
    key: "tree",
    label: "Sơ đồ dọc",
    getPath: (familyId: string) => paths.tree(familyId),
  },
  {
    key: "grid",
    label: "Lưới thế hệ",
    getPath: (familyId: string) => paths.grid(familyId),
  },
  {
    key: "htree",
    label: "Sơ đồ ngang",
    getPath: (familyId: string) => paths.htree(familyId),
  },
] as const;

export default function DiagramHeader({
  title,
  description,
  controls,
}: DiagramHeaderProps) {
  const [openSearch, setOpenSearch] = useState(false);
  const familyId = useFamilyId();
  const location = useLocation();

  const selectedRootLabel = useMemo(() => {
    if (!controls?.selectedRootId) return "Chọn thành viên gốc";
    const member = controls.members.find(
      (m) => m.id === controls.selectedRootId,
    );
    return member
      ? `Đời ${member.generation}: ${member.name} (${member.id})`
      : "Chọn thành viên gốc";
  }, [controls]);

  return (
    <header className="mb-6">
      <PageBreadcrumb
        items={[{ title: "Trang chủ", link: paths.home }, { title }]}
      />

      <div className="mb-4">
        <h1 className="text-[1.75rem] font-bold bg-linear-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">
          {title}
        </h1>
        {description ? (
          <p className="text-sm mt-0.5 text-gray-500">{description}</p>
        ) : null}
      </div>

      {controls ? (
        <div className="mb-4 grid grid-cols-3 items-center gap-3">
          <Popover open={openSearch} onOpenChange={setOpenSearch}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openSearch}
                className="h-12 w-80 justify-between rounded-xl border border-gray-200 bg-white px-3 text-left shadow-sm"
              >
                <span className="mr-2 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white">
                  <UserRound size={15} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col ">
                  <span className="text-[10px] leading-3 font-semibold uppercase tracking-wide text-gray-500">
                    Gốc hiển thị
                  </span>
                  <span className="truncate text-sm leading-5 font-semibold text-gray-900">
                    {selectedRootLabel}
                  </span>
                </span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <Command>
                <CommandInput placeholder="Tìm kiếm thành viên..." />
                <CommandList>
                  <CommandEmpty>Không tìm thấy thành viên nào.</CommandEmpty>
                  <CommandGroup>
                    {controls.members.map((member) => (
                      <CommandItem
                        key={member.id}
                        value={`${member.name} ${member.generation} ${member.id}`}
                        onSelect={() => {
                          controls.setSelectedRootId(member.id);
                          setOpenSearch(false);
                          controls.onRootChanged?.(member.id);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            controls.selectedRootId === member.id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {member.name} (Đời {member.generation})
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          <div className="flex justify-center items-center w-full">
            <div className="inline-flex items-center gap-1 rounded-xl bg-gray-100 p-1">
              {diagramNav.map((item) => {
                const href = item.getPath(familyId);
                const active = location.pathname === href;

                return (
                  <Link
                    key={item.key}
                    to={href}
                    className={cn(
                      "inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-white text-amber-700 shadow-sm"
                        : "text-gray-600 hover:text-gray-900",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 justify-self-end max-lg:order-2 max-lg:ml-auto max-sm:w-full max-sm:justify-end">
            <div className="inline-flex h-10 items-center rounded-xl border border-gray-200 bg-white shadow-sm">
              <button
                className="inline-flex h-10 w-9 items-center justify-center rounded-l-xl text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800"
                onClick={controls.onZoomOut}
                type="button"
                title="Thu nhỏ"
              >
                <Minus size={16} />
              </button>
              <span className="min-w-13 text-center text-sm font-semibold text-gray-700">
                {Math.round(controls.zoomLevel * 100)}%
              </span>
              <button
                className="inline-flex h-10 w-9 items-center justify-center rounded-r-xl text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-800"
                onClick={controls.onZoomIn}
                type="button"
                title="Phóng to"
              >
                <Plus size={16} />
              </button>
            </div>

            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
              onClick={controls.onCenterView}
              type="button"
              title="Đưa về trung tâm"
            >
              <LocateFixed size={16} />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="inline-flex h-10 items-center gap-1.5 rounded-xl border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-900"
                  type="button"
                >
                  <Filter size={15} />
                  Hiển thị
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="text-xs font-semibold tracking-wide text-gray-500">
                  HIỂN THỊ
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {DISPLAY_FILTER_ITEMS.map((item) => (
                  <DropdownMenuCheckboxItem
                    key={item.key}
                    checked={controls.filters[item.key]}
                    onCheckedChange={(checked) => {
                      controls.onFilterChange(item.key, checked === true);
                    }}
                  >
                    {item.label}
                  </DropdownMenuCheckboxItem>
                ))}

                <div className="px-2 py-1.5">
                  <div className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm text-gray-700">
                    <span className="font-medium">Số thế hệ</span>
                    <Input
                      type="number"
                      min={1}
                      placeholder="Tất cả"
                      value={controls.filters.generationLimit === null ? "" : controls.filters.generationLimit}
                      onChange={(event) => {
                        if (event.target.value === "") {
                          controls.onFilterChange("generationLimit", null);
                          return;
                        }
                        const parsed = Number.parseInt(event.target.value, 10);
                        if (!Number.isFinite(parsed)) return;
                        const next = Math.max(1, parsed);
                        controls.onFilterChange("generationLimit", next);
                      }}
                      onKeyDown={(event) => event.stopPropagation()}
                      className="h-9 w-18 text-center placeholder:text-[11px]"
                    />
                  </div>
                </div>

                <DropdownMenuSeparator />
                <DropdownMenuLabel className="text-xs font-semibold tracking-wide text-gray-500">
                  LỌC DỮ LIỆU
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {DATA_FILTER_ITEMS.map((item) => (
                  <DropdownMenuCheckboxItem
                    key={item.key}
                    checked={controls.filters[item.key]}
                    onCheckedChange={(checked) => {
                      controls.onFilterChange(item.key, checked === true);
                    }}
                  >
                    {item.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      ) : (
        <div className="mb-4 flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-xl bg-gray-100 p-1">
            {diagramNav.map((item) => {
              const href = item.getPath(familyId);
              const active = location.pathname === href;

              return (
                <Link
                  key={item.key}
                  to={href}
                  className={cn(
                    "inline-flex h-9 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-white text-amber-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
