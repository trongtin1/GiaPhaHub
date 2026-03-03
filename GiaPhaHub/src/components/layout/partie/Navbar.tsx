import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { TreePine, AlignJustify } from "lucide-react";
import { Menu, Drawer, Button } from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  ApartmentOutlined,
  ClusterOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useFamilyId } from "@/hooks/useFamilyId";
import { paths } from "@/router/paths";

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const familyId = useFamilyId();
  const location = useLocation();
  const navigate = useNavigate();

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
      ],
    },
  ];

  const selectedKey = location.pathname;

  const handleNavigate = ({ key }: { key: string }) => {
    if (key !== "family-diagram") {
      navigate(key);
      setMobileOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <div className="w-9 h-9 rounded-xl bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/30 transition-shadow duration-300">
              <TreePine size={20} className="text-white" />
            </div>
            <span className="text-lg font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Gia Phả Online
            </span>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <Menu
              mode="horizontal"
              selectedKeys={[selectedKey]}
              defaultOpenKeys={["family-diagram"]}
              items={menuItems}
              onClick={handleNavigate}
              className="border-none! bg-transparent! min-w-80"
            />
          </div>

          {/* Mobile toggle */}
          {mobileOpen && (
            <Button
              type="text"
              className="md:hidden"
              icon={<AlignJustify size={22} />}
              onClick={() => setMobileOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      <Drawer
        title={
          <span className="font-bold text-base bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Gia Phả Online
          </span>
        }
        placement="right"
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
        width={260}
        styles={{ body: { padding: 0 } }}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={["family-diagram"]}
          items={menuItems}
          onClick={handleNavigate}
          className="border-none!"
        />
      </Drawer>
    </nav>
  );
};

export default Navbar;
