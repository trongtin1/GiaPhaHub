import { useNavigate } from "react-router-dom";
import { Home, AlertTriangle } from "lucide-react";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="text-center flex flex-col items-center gap-3">
        <AlertTriangle size={64} className="opacity-60 text-amber-500" />
        <h1 className="text-[5rem] font-extrabold leading-none bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-xl text-gray-500">Không tìm thấy trang</h2>
        <p className="mb-3 text-gray-400">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
        </p>
        <button
          className="inline-flex items-center gap-2 px-5 py-2.5 border-none rounded-lg text-sm font-semibold cursor-pointer text-white bg-gradient-to-r from-amber-500 to-orange-600 shadow-sm hover:-translate-y-px hover:shadow-md transition-all duration-150"
          onClick={() => navigate("/")}
        >
          <Home size={18} /> Về trang chủ
        </button>
      </div>
    </div>
  );
};

export default NotFound;
