import { Link } from "react-router-dom";
import { TreePine, Heart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link
              to="/"
              className="flex items-center gap-2.5 no-underline mb-3"
            >
              <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <TreePine size={18} className="text-white" />
              </div>
              <span className="text-base font-bold bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                Gia Phả Online
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Lưu giữ và kết nối thế hệ trong gia đình bạn. Xây dựng cây gia phả
              trực tuyến dễ dàng.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Khám phá
            </h4>
            <div className="flex flex-col gap-2">
              <Link
                to="/members"
                className="text-sm text-gray-500 hover:text-amber-600 transition-colors no-underline"
              >
                Thành viên
              </Link>
              <Link
                to="/tree"
                className="text-sm text-gray-500 hover:text-amber-600 transition-colors no-underline"
              >
                Cây gia phả
              </Link>
              <Link
                to="/dashboard"
                className="text-sm text-gray-500 hover:text-amber-600 transition-colors no-underline"
              >
                Tổng quan
              </Link>
            </div>
          </div>

          {/* About */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">
              Giới thiệu
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              Gia Phả Online giúp bạn xây dựng, quản lý và chia sẻ cây gia phả
              một cách trực quan và hiện đại.
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © 2026 Gia Phả Online. Tất cả quyền được bảo lưu.
          </p>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            Tạo với <Heart size={12} className="text-rose-500" /> bởi cộng đồng
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
