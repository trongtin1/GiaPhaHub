import { useMemo, useState } from "react";
import {
  Card,
  Empty,
  Image,
  Input,
  Modal,
  Segmented,
  Select,
  Tag,
  type GetProp,
} from "antd";
import dayjs from "dayjs";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import { useFamily } from "@/context/useFamily";
import { paths } from "@/router/paths";
import { familyPhotoMocks, type FamilyPhotoItem } from "@/mocks/familyPhotos";

type SortValue = "newest" | "oldest";
type SelectValue = GetProp<typeof Select, "value">;

export default function GalleryPage() {
  const { members } = useFamily();
  const [keyword, setKeyword] = useState("");
  const [sortBy, setSortBy] = useState<SortValue>("newest");
  const [memberFilter, setMemberFilter] = useState<number | undefined>();
  const [tagFilter, setTagFilter] = useState<string | undefined>();
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
          !memberFilter || item.memberIds.includes(memberFilter);
        const matchTag = !tagFilter || item.tags.includes(tagFilter);

        return matchSearch && matchMember && matchTag;
      })
      .sort((a, b) => {
        const delta =
          dayjs(a.capturedAt).valueOf() - dayjs(b.capturedAt).valueOf();
        return sortBy === "oldest" ? delta : -delta;
      });
  }, [keyword, memberFilter, tagFilter, memberMap, sortBy]);

  const handleMemberChange = (value: SelectValue) => {
    setMemberFilter(typeof value === "number" ? value : undefined);
  };

  const handleTagChange = (value: SelectValue) => {
    setTagFilter(typeof value === "string" ? value : undefined);
  };

  return (
    <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-[fadeIn_0.4s_ease]">
      <PageBreadcrumb
        items={[
          { title: "Trang chu", link: paths.home },
          { title: "Thu vien anh" },
        ]}
      />

      <div className="flex items-center justify-between mb-7 flex-wrap gap-4 max-md:flex-col max-md:items-stretch">
        <div>
          <h1 className="text-[1.75rem] font-bold bg-linear-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            Thu Vien Anh Gia Dinh
          </h1>
          <p className="text-sm mt-0.5 text-gray-500">
            {filtered.length} hinh anh ky niem
          </p>
        </div>

        <Segmented
          value={sortBy}
          onChange={(value) => setSortBy(value as SortValue)}
          options={[
            { label: "Moi nhat", value: "newest" },
            { label: "Cu nhat", value: "oldest" },
          ]}
        />
      </div>

      <Card className="rounded-2xl shadow-sm border border-gray-100 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Input.Search
            placeholder="Tim anh theo ten, dia diem, tag..."
            allowClear
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            onSearch={setKeyword}
          />

          <Select
            value={memberFilter}
            onChange={handleMemberChange}
            allowClear
            placeholder="Loc theo thanh vien"
            options={members.map((member) => ({
              label: member.name,
              value: member.id,
            }))}
          />

          <Select
            value={tagFilter}
            onChange={handleTagChange}
            allowClear
            placeholder="Loc theo chu de"
            options={allTags.map((tag) => ({
              value: tag,
              label: `#${tag}`,
            }))}
          />
        </div>
      </Card>

      {filtered.length === 0 ? (
        <Card className="rounded-2xl shadow-sm border border-amber-100">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Khong co hinh anh phu hop voi bo loc hien tai"
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((photo) => {
            const memberNames = photo.memberIds
              .map((memberId) => memberMap.get(memberId) ?? `TV #${memberId}`)
              .join(", ");

            return (
              <button
                type="button"
                key={photo.id}
                className="text-left bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                onClick={() => setActivePhoto(photo)}
              >
                <div className="aspect-16/10 bg-gray-100 overflow-hidden">
                  <Image
                    src={photo.url}
                    alt={photo.title}
                    preview={false}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-base font-semibold text-gray-900 line-clamp-1">
                    {photo.title}
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {dayjs(photo.capturedAt).format("DD/MM/YYYY")}
                    {photo.location ? ` - ${photo.location}` : ""}
                  </p>
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                    {memberNames}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {photo.tags.slice(0, 3).map((tag) => (
                      <Tag key={`${photo.id}-${tag}`} className="m-0">
                        #{tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <Modal
        open={!!activePhoto}
        onCancel={() => setActivePhoto(null)}
        footer={null}
        width={920}
        title={activePhoto?.title}
      >
        {activePhoto && (
          <div>
            <Image
              src={activePhoto.url}
              alt={activePhoto.title}
              className="w-full rounded-xl max-h-[65vh] object-cover"
            />
            <div className="mt-4 text-sm text-gray-600 space-y-2">
              <p>
                <strong>Ngay chup:</strong>{" "}
                {dayjs(activePhoto.capturedAt).format("DD/MM/YYYY")}
              </p>
              {activePhoto.location && (
                <p>
                  <strong>Dia diem:</strong> {activePhoto.location}
                </p>
              )}
              <p>
                <strong>Thanh vien:</strong>{" "}
                {activePhoto.memberIds
                  .map(
                    (memberId) => memberMap.get(memberId) ?? `TV #${memberId}`,
                  )
                  .join(", ")}
              </p>
              {activePhoto.description && (
                <p>
                  <strong>Mo ta:</strong> {activePhoto.description}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {activePhoto.tags.map((tag) => (
                  <Tag key={`modal-${activePhoto.id}-${tag}`} className="m-0">
                    #{tag}
                  </Tag>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
