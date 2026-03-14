import { useEffect } from "react";
import { Modal, Form, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import { useFamily } from "@/context/useFamily";
import type {
  FamilyMemberResponse,
  FamilyMemberRequest,
} from "@/models/FamilyMember";
import { getParentId, getSpouseId } from "@/utils/relationshipUtils";
interface MemberFormProps {
  open: boolean;
  onClose: () => void;
  editMember?: FamilyMemberResponse | null;
}

export default function MemberForm({
  open,
  onClose,
  editMember,
}: MemberFormProps) {
  const { members, addMember, updateMember } = useFamily();
  const [form] = Form.useForm();

  useEffect(() => {
    if (open) {
      if (editMember) {
        const parentId = getParentId(editMember);
        const spouseId = getSpouseId(editMember);
        form.setFieldsValue({
          name: editMember.name,
          gender: editMember.gender,
          birthDate: editMember.birthDate ? dayjs(editMember.birthDate) : null,
          deathDate: editMember.deathDate ? dayjs(editMember.deathDate) : null,
          phone: editMember.phone || "",
          address: editMember.address || "",
          bio: editMember.bio || "",
          parentId,
          spouseId,
        });
      } else {
        form.resetFields();
      }
    }
  }, [editMember, open, form]);

  const potentialParents = members.filter(
    (m) => m.id !== editMember?.id && m.id !== form.getFieldValue("spouseId"),
  );
  const potentialSpouses = members.filter(
    (m) =>
      m.id !== editMember?.id &&
      m.id !== form.getFieldValue("parentId") &&
      getParentId(m) !== editMember?.id,
  );

  const handleFinish = (values: Record<string, unknown>) => {
    let generation = editMember?.generation ?? 1;
    if (values.parentId) {
      const parent = members.find((m) => m.id === values.parentId);
      if (parent) generation = parent.generation + 1;
    }

    const memberData: Omit<FamilyMemberRequest, "id"> = {
      name: (values.name as string).trim(),
      gender: values.gender as "male" | "female",
      birthDate: values.birthDate
        ? (values.birthDate as dayjs.Dayjs).format("YYYY-MM-DD")
        : "",
      deathDate: values.deathDate
        ? (values.deathDate as dayjs.Dayjs).format("YYYY-MM-DD")
        : "",
      phone: (values.phone as string) || "",
      address: (values.address as string) || "",
      bio: (values.bio as string) || "",
      parentId: (values.parentId as number) || 0,
      spouseId: (values.spouseId as number) || 0,
      spouseRelationship: values.spouseId ? "Vợ/Chồng" : "",
      avatar: "",
      generation,
    };

    if (editMember) {
      updateMember({ id: editMember.id, payload: memberData });
    } else {
      addMember(memberData);
    }
    onClose();
  };

  return (
    <Modal
      title={editMember ? "Chỉnh sửa thành viên" : "Thêm thành viên mới"}
      open={open}
      onCancel={onClose}
      onOk={() => form.submit()}
      okText={editMember ? "Cập nhật" : "Thêm mới"}
      cancelText="Hủy"
      width={600}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ gender: "male" }}
      >
        <Form.Item
          label="Họ và tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Giới tính" name="gender">
            <Select
              options={[
                { value: "male", label: "Nam" },
                { value: "female", label: "Nữ" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Ngày sinh" name="birthDate">
            <DatePicker
              placeholder="Chọn ngày sinh"
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item label="Ngày mất" name="deathDate">
            <DatePicker
              placeholder="Chọn ngày mất"
              format="DD/MM/YYYY"
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phone">
            <Input placeholder="0901234567" />
          </Form.Item>
        </div>

        <Form.Item label="Địa chỉ" name="address">
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item label="Cha / Mẹ" name="parentId">
            <Select
              placeholder="-- Không --"
              allowClear
              showSearch
              optionFilterProp="label"
              options={potentialParents.map((m) => ({
                value: m.id,
                label: `${m.name} (Đời ${m.generation})`,
              }))}
            />
          </Form.Item>

          <Form.Item label="Vợ / Chồng" name="spouseId">
            <Select
              placeholder="-- Không --"
              allowClear
              showSearch
              optionFilterProp="label"
              options={potentialSpouses.map((m) => ({
                value: m.id,
                label: m.name,
              }))}
            />
          </Form.Item>
        </div>

        <Form.Item label="Tiểu sử" name="bio">
          <Input.TextArea placeholder="Nhập tiểu sử ngắn..." rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
