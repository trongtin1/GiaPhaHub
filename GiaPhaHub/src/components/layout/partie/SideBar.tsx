import { Layout } from "antd";
import { ApartmentOutlined } from "@ant-design/icons";
import AppMenu from "./AppMenu";

const { Sider } = Layout;

interface SideBarProps {
  collapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({ collapsed, onCollapse }) => {
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}
      width={240}
      collapsedWidth={72}
      className="fixed! left-0 top-0 bottom-0 z-50 h-screen overflow-auto"
      style={{
        background: "#161625",
        borderRight: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <ApartmentOutlined className="text-2xl" style={{ color: "#6366f1" }} />
        {!collapsed && (
          <span
            className="text-lg font-bold whitespace-nowrap"
            style={{ color: "#6366f1" }}
          >
            Gia Phả
          </span>
        )}
      </div>

      {/* Menu */}
      <AppMenu />

      {/* Footer */}
      {!collapsed && (
        <div className="absolute bottom-12 left-0 right-0 px-4 text-center">
          <p className="text-xs" style={{ color: "#6b6b85" }}>
            © 2026 Gia Phả Online
          </p>
        </div>
      )}
    </Sider>
  );
};

export default SideBar;
