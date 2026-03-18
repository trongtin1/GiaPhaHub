import { Loader2 } from "lucide-react";

interface LoadingProps {
  tip?: string;
  size?: "small" | "default" | "large";
  fullScreen?: boolean;
}

const sizeMap = {
  small: "size-6",
  default: "size-8",
  large: "size-12",
};

const Loading: React.FC<LoadingProps> = ({
  tip = "Đang tải...",
  size = "large",
  fullScreen = false,
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 w-full ${fullScreen ? "min-h-screen" : "py-12"}`}
    >
      <Loader2
        className={`${sizeMap[size]} animate-spin text-amber-500`}
      />
      {tip && <p className="text-sm text-gray-400">{tip}</p>}
    </div>
  );
};

export default Loading;
