import { Layout, Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const { Header } = Layout;

interface HeaderBarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const HeaderBar: React.FC<HeaderBarProps> = ({ collapsed, onToggle }) => {
  return (
    <Header
      className="flex items-center px-6 sticky top-0 z-40"
      style={{
        background: "#161625",
        borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
        padding: "0 24px",
        height: 64,
      }}
    >
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={onToggle}
        className="!text-gray-400 hover:!text-white !text-lg"
      />
    </Header>
  );
};

export default HeaderBar;
