import { useState } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Modal, Input, Select, Table, Tooltip, Button, Tag } from "antd";
import type { TableColumnsType } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { useFamily } from "@/context/useFamily";
import MemberForm from "@/components/MemberForm";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";

import { useFamilyId } from "@/hooks/useFamilyId";
import { paths } from "@/router/paths";
import type { FamilyMember } from "@/types";

export default function Members() {
  const { members, deleteMember } = useFamily();
  const navigate = useNavigate();
  const familyId = useFamilyId();
  const [search, setSearch] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterGen, setFilterGen] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editMember, setEditMember] = useState<FamilyMember | null>(null);

  const generations = [...new Set(members.map((m) => m.generation))].sort();

  const filtered = members.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchGender = !filterGender || m.gender === filterGender;
    const matchGen = !filterGen || m.generation === Number(filterGen);
    return matchSearch && matchGender && matchGen;
  });

  const handleEdit = (member: FamilyMember) => {
    setEditMember(member);
    setFormOpen(true);
  };
  const handleAdd = () => {
    setEditMember(null);
    setFormOpen(true);
  };
  const columns: TableColumnsType<FamilyMember> = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      render: (_, m) => (
        <div className="flex items-center gap-2.5 font-medium text-gray-900">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${m.gender === "male" ? "bg-blue-500" : "bg-pink-500"}`}
          />
          {m.name}
          {m.deathDate && (
            <Tag color="red" className="ml-1" style={{ fontSize: 11 }}>
              Đã mất
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      width: 100,
      render: (g: string) => (
        <span className="text-gray-500">{g === "male" ? "Nam" : "Nữ"}</span>
      ),
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthDate",
      key: "birthDate",
      width: 130,
      render: (d: string) => <span className="text-gray-500">{d || "—"}</span>,
    },
    {
      title: "Thế hệ",
      dataIndex: "generation",
      key: "generation",
      width: 100,
      render: (g: number) => <Tag color="gold">Đời {g}</Tag>,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      render: (a: string) => <span className="text-gray-500">{a || "—"}</span>,
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 120,
      render: (_, m) => (
        <div className="flex gap-1">
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              size="small"
              icon={<Eye size={15} />}
              onClick={() => navigate(paths.member(familyId, m.id))}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              size="small"
              icon={<Pencil size={15} />}
              onClick={() => handleEdit(m)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              type="text"
              size="small"
              danger
              icon={<Trash2 size={15} />}
              onClick={() => handleDelete(m)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  const handleDelete = (member: FamilyMember) => {
    Modal.confirm({
      title: "Xóa thành viên",
      icon: <ExclamationCircleFilled />,
      content: (
        <>
          Bạn có chắc muốn xóa <strong>{member.name}</strong> khỏi gia phả? Hành
          động này không thể hoàn tác.
        </>
      ),
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        deleteMember(member.id);
      },
    });
  };

  return (
    <div className="max-w-300 mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-[fadeIn_0.4s_ease]">
      <PageBreadcrumb
        items={[
          { title: "Trang chủ", link: paths.home },
          { title: "Thành viên" },
        ]}
      />

      <div className="flex items-center justify-between mb-7 flex-wrap gap-4 max-md:flex-col max-md:items-stretch">
        <div>
          <h1 className="text-[1.75rem] font-bold bg-linear-to-r from-amber-600 via-orange-500 to-rose-500 bg-clip-text text-transparent">
            Thành Viên Gia Phả
          </h1>
          <p className="text-sm mt-0.5 text-gray-500">
            {members.length} thành viên trong gia phả
          </p>
        </div>
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-150 whitespace-nowrap text-white bg-linear-to-r from-amber-500 to-orange-600 shadow-sm hover:-translate-y-px hover:shadow-md"
          onClick={handleAdd}
        >
          <Plus size={18} /> Thêm thành viên
        </button>
      </div>

      <div className="flex gap-3 mb-5 flex-wrap max-md:flex-col">
        <Input.Search
          placeholder="Tìm kiếm theo tên..."
          allowClear
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={(v) => setSearch(v)}
          className="flex-1 min-w-50"
        />
        <Select
          value={filterGender || undefined}
          onChange={(v) => setFilterGender(v ?? "")}
          placeholder="Tất cả giới tính"
          allowClear
          style={{ minWidth: 160 }}
          options={[
            { value: "male", label: "Nam" },
            { value: "female", label: "Nữ" },
          ]}
        />
        <Select
          value={filterGen || undefined}
          onChange={(v) => setFilterGen(v ?? "")}
          placeholder="Tất cả thế hệ"
          allowClear
          style={{ minWidth: 160 }}
          options={generations.map((g) => ({
            value: String(g),
            label: `Đời ${g}`,
          }))}
        />
      </div>

      <Table
        columns={columns}
        dataSource={filtered}
        rowKey="id"
        size="middle"
        pagination={{ pageSize: 15, showSizeChanger: false }}
        rowClassName={(m) => (m.deathDate ? "opacity-60" : "")}
        locale={{ emptyText: "Không tìm thấy thành viên nào" }}
      />

      <MemberForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditMember(null);
        }}
        editMember={editMember}
      />
    </div>
  );
}
