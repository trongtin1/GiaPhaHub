import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

interface LoadingProps {
  tip?: string;
  size?: "small" | "default" | "large";
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({
  tip = "Đang tải...",
  size = "large",
  fullScreen = false,
}) => {
  const indicator = (
    <LoadingOutlined style={{ fontSize: size === "large" ? 48 : 24 }} spin />
  );

  return (
    <div
      className={`flex justify-center items-center w-full ${fullScreen ? "min-h-screen" : "py-12"}`}
    >
      <Spin indicator={indicator} tip={tip} size={size}>
        <div className="p-12" />
      </Spin>
    </div>
  );
};

export default Loading;
