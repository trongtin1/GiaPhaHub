import {
  HomeOutlined,
  TeamOutlined,
  ApartmentOutlined,
  ClusterOutlined,
  AppstoreOutlined,
  AlignLeftOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useFamilyId } from "@/hooks/useFamilyId";
import { paths } from "@/router/paths";

const AppMenu: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const familyId = useFamilyId();

  const menuItems = [
    { key: paths.home, icon: <HomeOutlined />, label: "Trang chủ" },
    {
      key: paths.members(familyId),
      icon: <TeamOutlined />,
      label: "Thành viên",
    },
    {
      key: "family-diagram",
      icon: <ApartmentOutlined />,
      label: "Sơ đồ gia đình",
      children: [
        {
          key: paths.tree(familyId),
          icon: <ClusterOutlined />,
          label: "Sơ đồ cây",
        },
        {
          key: paths.grid(familyId),
          icon: <AppstoreOutlined />,
          label: "Lưới thế hệ",
        },
        {
          key: paths.htree(familyId),
          icon: <AlignLeftOutlined />,
          label: "Sơ đồ ngang",
        },
      ],
    },
  ];

  const selectedKey = location.pathname.includes("/members/")
    ? paths.members(familyId)
    : location.pathname;

  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      defaultOpenKeys={["family-diagram"]}
      items={menuItems}
      onClick={({ key }) => navigate(key)}
      className="border-none! bg-transparent!"
    />
  );
};

export default AppMenu;
