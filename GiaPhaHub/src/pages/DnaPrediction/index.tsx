import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeftRight,
  Check,
  ChevronsUpDown,
  FlaskConical,
  UserRound,
  Users,
} from "lucide-react";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/features";
import {
  selectAllMembers,
  selectFamilyError,
  selectFamilyLoading,
} from "@/features/slices/family/selectors";
import { fetchMembers } from "@/features/slices/family/thunks";
import {
  selectKinshipError,
  selectKinshipLoading,
  selectKinshipResult,
} from "@/features/slices/relationship/selectors";
import { clearKinshipResult } from "@/features/slices/relationship/slice";
import { inferKinship } from "@/features/slices/relationship/thunks";
import { paths } from "@/router/paths";

export default function DnaPredictionPage() {
  const dispatch = useAppDispatch();
  const members = useAppSelector(selectAllMembers);
  const membersLoading = useAppSelector(selectFamilyLoading);
  const membersError = useAppSelector(selectFamilyError) ?? "";
  const kinshipResult = useAppSelector(selectKinshipResult);
  const kinshipLoading = useAppSelector(selectKinshipLoading);
  const kinshipError = useAppSelector(selectKinshipError) ?? "";

  const [memberAId, setMemberAId] = useState<string>("");
  const [memberBId, setMemberBId] = useState<string>("");
  const [isMemberAOpen, setIsMemberAOpen] = useState(false);
  const [isMemberBOpen, setIsMemberBOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMembers());
  }, [dispatch]);

  useEffect(() => {
    const aId = Number(memberAId);
    const bId = Number(memberBId);

    if (!aId || !bId) {
      dispatch(clearKinshipResult());
      return;
    }

    dispatch(
      inferKinship({
        sourceMemberId: aId,
        targetMemberId: bId,
      }),
    );
  }, [dispatch, memberAId, memberBId]);

  const memberA = memberAId
    ? members.find((m) => m.id === Number(memberAId))
    : undefined;
  const memberB = memberBId
    ? members.find((m) => m.id === Number(memberBId))
    : undefined;

  const canSwap = !!memberAId || !!memberBId;

  const memberBOptions = useMemo(
    () => members.filter((m) => String(m.id) !== memberAId),
    [members, memberAId],
  );

  const handleSwapMembers = () => {
    const currentA = memberAId;
    setMemberAId(memberBId);
    setMemberBId(currentA);
  };

  const renderMemberSelector = (
    label: string,
    inputId: string,
    value: string,
    onChange: (value: string) => void,
    open: boolean,
    onOpenChange: (open: boolean) => void,
    options: typeof members,
    selectedName?: string,
  ) => (
    <div className="min-w-0 flex-1">
      <label
        htmlFor={inputId}
        className="mb-3 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400"
      >
        {label}
      </label>

      <div className="rounded-2xl border border-slate-200 bg-white p-3 transition-all focus-within:border-amber-300 focus-within:shadow-[0_0_0_3px_rgba(251,191,36,0.16)]">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <UserRound size={22} />
          </div>

          <div className="min-w-0 flex-1">
            <Popover open={open} onOpenChange={onOpenChange}>
              <PopoverTrigger asChild>
                <Button
                  id={inputId}
                  type="button"
                  variant="ghost"
                  role="combobox"
                  aria-expanded={open}
                  className="h-10 w-full justify-between border-none bg-transparent px-0 text-left text-lg font-semibold text-slate-600 shadow-none hover:bg-transparent"
                >
                  <span className="truncate">
                    {selectedName || "Chọn thành viên..."}
                  </span>
                  <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-60" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-(--radix-popover-trigger-width) rounded-xl border border-slate-200 bg-white p-0 shadow-xl"
              >
                <Command>
                  <CommandInput placeholder="Tìm thành viên..." />
                  <CommandList>
                    <CommandEmpty>Không tìm thấy thành viên.</CommandEmpty>
                    <CommandGroup>
                      <CommandItem
                        value="Bỏ chọn"
                        onSelect={() => {
                          onChange("");
                          onOpenChange(false);
                        }}
                        className="text-slate-500"
                      >
                        <Check
                          className={cn(
                            "size-4",
                            value === "" ? "opacity-100" : "opacity-0",
                          )}
                        />
                        Bỏ chọn
                      </CommandItem>

                      {options.map((member) => (
                        <CommandItem
                          key={member.id}
                          value={`${member.name} ${member.generation} ${member.id}`}
                          onSelect={() => {
                            onChange(String(member.id));
                            onOpenChange(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "size-4",
                              value === String(member.id)
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                          {member.name} - Đời {member.generation}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {selectedName ? (
              <p className="truncate text-xs text-slate-500">{selectedName}</p>
            ) : (
              <p className="text-xs text-slate-400">Chưa chọn thành viên</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 animate-[fadeIn_0.35s_ease]">
      <PageBreadcrumb
        items={[
          { title: "Trang chủ", link: paths.home },
          { title: "Tra cứu danh xưng" },
        ]}
      />

      <div className="mb-6">
        <h1 className="text-[2.25rem] font-extrabold leading-tight tracking-tight text-slate-800 max-sm:text-[1.9rem]">
          Tra cứu danh xưng
        </h1>
        <p className="mt-1.5 text-[1.05rem] text-slate-600 max-sm:text-sm">
          Chọn hai thành viên để tự động tính cách gọi theo quan hệ gia phả
        </p>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-[#fbfbfb] p-7 shadow-[0_2px_12px_rgba(15,23,42,0.06)] max-sm:p-4">
        <div className="flex items-end gap-4 max-lg:flex-col max-lg:items-stretch">
          {renderMemberSelector(
            "Thành viên A",
            "member-a",
            memberAId,
            setMemberAId,
            isMemberAOpen,
            setIsMemberAOpen,
            members,
            memberA?.name,
          )}

          <div className="flex shrink-0 items-center justify-center max-lg:py-1">
            <button
              type="button"
              onClick={handleSwapMembers}
              disabled={!canSwap}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-all hover:-translate-y-px hover:border-amber-300 hover:text-amber-600 disabled:cursor-not-allowed disabled:opacity-50"
              title="Đổi vị trí hai thành viên"
            >
              <ArrowLeftRight size={20} />
            </button>
          </div>

          {renderMemberSelector(
            "Thành viên B",
            "member-b",
            memberBId,
            setMemberBId,
            isMemberBOpen,
            setIsMemberBOpen,
            memberBOptions,
            memberB?.name,
          )}
        </div>
      </section>

      <section className="mt-8 min-h-72 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_2px_14px_rgba(15,23,42,0.06)] max-sm:p-4">
        {membersError ? (
          <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {membersError}
          </p>
        ) : null}
        {kinshipError ? (
          <p className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {kinshipError}
          </p>
        ) : null}

        {!memberA || !memberB ? (
          <div className="flex min-h-60 flex-col items-center justify-center text-center text-slate-400">
            <Users size={54} className="mb-4 opacity-45" />
            <p className="text-[2rem] font-semibold leading-none text-slate-300">
              - -
            </p>
            <p className="mt-2 text-3xl font-semibold text-slate-300">- -</p>
            <p className="mt-4 text-[2rem] font-bold leading-none text-slate-300">
              - -
            </p>
            <p className="mt-5 text-3xl font-semibold text-slate-400 max-sm:text-xl">
              Chọn hai thành viên để tính quan hệ
            </p>
            {membersLoading ? (
              <p className="mt-2 text-sm text-slate-500">
                Đang tải thành viên...
              </p>
            ) : null}
          </div>
        ) : (
          <>
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-slate-800">
              <FlaskConical size={19} className="text-amber-600" />
              Kết quả phân tích quan hệ
            </h2>

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
              {kinshipLoading ? (
                <p className="mb-3 text-sm text-slate-500">
                  Đang phân tích quan hệ từ API...
                </p>
              ) : null}

              <p className="mb-3 text-base text-slate-700">
                So sánh <span className="font-bold">{memberA.name}</span> với{" "}
                <span className="font-bold">{memberB.name}</span>
              </p>

              {kinshipResult && (
                <>
                  <div className="mb-4 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                        {memberA.name} gọi {memberB.name} là
                      </p>
                      <p className="mt-2 text-4xl font-bold leading-tight text-amber-700 max-sm:text-3xl">
                        {kinshipResult.sourceCallLabel}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                        {memberB.name} gọi {memberA.name} là
                      </p>
                      <p className="mt-2 text-4xl font-bold leading-tight text-amber-700 max-sm:text-3xl">
                        {kinshipResult.targetCallLabel}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-600">
                    {kinshipResult.humanReadable}
                  </p>

                  {!kinshipResult.isBloodRelated && (
                    <p className="mt-2 text-xs text-slate-500">
                      Lưu ý: Đây là quan hệ không huyết thống trực tiếp, kết quả
                      chỉ mang tính tham khảo theo dữ liệu gia phả.
                    </p>
                  )}
                </>
              )}
            </div>
          </>
        )}
      </section>

      <p className="mt-4 text-xs text-slate-400">
        Mẹo: Bạn có thể đổi nhanh vị trí A/B bằng nút mũi tên ở giữa để xem kết
        quả theo chiều ngược lại.
      </p>
    </div>
  );
}
