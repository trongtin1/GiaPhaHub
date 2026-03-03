import { useNavigate } from "react-router-dom";
import { TreePine, Users, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { paths, DEFAULT_FAMILY_ID } from "@/router/paths";

export default function Homepage() {
  const navigate = useNavigate();
  const fid = DEFAULT_FAMILY_ID;

  const features = [
    {
      icon: TreePine,
      title: "Cây Gia Phả Trực Quan",
      desc: "Xem toàn bộ dòng họ qua sơ đồ cây tương tác, zoom và kéo thả tự do.",
      color: "from-emerald-500 to-teal-600",
      bg: "bg-emerald-50",
    },
    {
      icon: Users,
      title: "Quản Lý Thành Viên",
      desc: "Thêm, sửa, xóa thông tin chi tiết của từng thành viên trong gia đình.",
      color: "from-amber-500 to-orange-600",
      bg: "bg-amber-50",
    },
    {
      icon: BookOpen,
      title: "Lưu Giữ Lịch Sử",
      desc: "Ghi chép tiểu sử, ngày sinh, nơi ở — bảo tồn ký ức cho các thế hệ.",
      color: "from-rose-500 to-pink-600",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="overflow-hidden">
      {/* ══ Hero ══ */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 bg-linear-to-b from-amber-50/50 via-white to-white">
        {/* Decorative blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-150 h-150 -top-40 -left-40 rounded-full bg-amber-200/30 blur-[120px] animate-[pulse_6s_ease-in-out_infinite]" />
          <div className="absolute w-125 h-125 -bottom-32 -right-32 rounded-full bg-rose-200/20 blur-[100px] animate-[pulse_8s_ease-in-out_infinite_1s]" />
          <div className="absolute w-100 h-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-200/15 blur-[80px] animate-[pulse_7s_ease-in-out_infinite_2s]" />
        </div>

        {/* Dot pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #f59e0b 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-xs font-semibold mb-6 animate-[fadeInUp_0.6s_ease]">
            <Sparkles size={14} />
            Kết nối dòng họ — Lưu giữ giá trị
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-6 animate-[fadeInUp_0.6s_ease_0.1s_both]">
            <span className="text-gray-900">Xây dựng </span>
            <span className="bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              sơ đồ gia phả trực tuyến
            </span>
            <br />
            <span className="text-gray-900">cho dòng họ bạn</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-[fadeInUp_0.6s_ease_0.2s_both]">
            Lưu giữ lịch sử gia đình, kết nối các thế hệ và chia sẻ câu chuyện
            dòng họ với giao diện trực quan, hiện đại.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[fadeInUp_0.6s_ease_0.3s_both]">
            <button
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold cursor-pointer border-none text-white bg-linear-to-r from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-300"
              onClick={() => navigate(paths.tree(fid))}
            >
              <TreePine size={18} />
              Xem Sơ đồ Gia Đình
              <ArrowRight
                size={16}
                className="group-hover:translate-x-0.5 transition-transform"
              />
            </button>
            <button
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-bold cursor-pointer text-gray-700 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5 transition-all duration-300"
              onClick={() => navigate(paths.members(fid))}
            >
              <Users size={18} />
              Khám Phá Thành Viên
            </button>
          </div>
        </div>
      </section>
      {/* ══ Features ══ */}
      <section className="relative py-20 px-4 bg-gray-50/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              Tính năng{" "}
              <span className="bg-linear-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                nổi bật
              </span>
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Mọi thứ bạn cần để xây dựng và quản lý cây gia phả trực tuyến
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div
                key={title}
                className="group relative p-8 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 transition-all duration-300 hover:-translate-y-1"
              >
                <div
                  className={`w-14 h-14 rounded-xl bg-linear-to-br ${color} flex items-center justify-center mb-5 shadow-lg`}
                >
                  <Icon size={26} className="text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CTA Bottom ══ */}
      <section className="relative py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative p-10 sm:p-14 rounded-3xl overflow-hidden bg-linear-to-br from-amber-50 via-orange-50 to-rose-50 border border-amber-100">
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-4">
                Bắt đầu xây dựng gia phả ngay hôm nay
              </h2>
              <p className="text-gray-500 mb-8 max-w-lg mx-auto">
                Khám phá cây gia phả trực quan, quản lý thông tin thành viên và
                kết nối các thế hệ trong gia đình bạn.
              </p>
              <button
                className="group inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl text-sm font-bold cursor-pointer border-none text-white bg-linear-to-r from-amber-500 to-orange-600 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:-translate-y-0.5 transition-all duration-300"
                onClick={() => navigate(paths.tree(fid))}
              >
                Khám Phá Ngay
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
