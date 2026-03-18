import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  TreePine,
  AlignJustify,
  LogIn,
  LogOut,
  Home,
  Users,
  GitFork,
  LayoutGrid,
  Image,
  CalendarDays,
  ChevronDown,
  Dna,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFamilyId } from "@/hooks/useFamilyId";
import { paths } from "@/router/paths";
import { useAppDispatch, useAppSelector } from "@/features";
import { logout } from "@/features/slices/auth/thunks";

interface NavItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  children?: { key: string; icon: React.ReactNode; label: string }[];
}

const Navbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const familyId = useFamilyId();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const accessToken = useAppSelector((s) => s.auth.accessToken);
  const isLoggedIn = !!accessToken;

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  const menuItems: NavItem[] = [
    { key: paths.home, icon: <Home size={16} />, label: "Trang chủ" },
    {
      key: paths.members(familyId),
      icon: <Users size={16} />,
      label: "Thành viên",
    },
    {
      key: "family-diagram",
      icon: <GitFork size={16} />,
      label: "Sơ đồ gia đình",
      children: [
        {
          key: paths.tree(familyId),
          icon: <TreePine size={16} />,
          label: "Sơ đồ cây",
        },
        {
          key: paths.grid(familyId),
          icon: <LayoutGrid size={16} />,
          label: "Lưới thế hệ",
        },
      ],
    },
    {
      key: paths.events(familyId),
      icon: <CalendarDays size={16} />,
      label: "Sự kiện",
    },
    {
      key: paths.dnaPrediction(familyId),
      icon: <Dna size={16} />,
      label: "DNA",
    },
    {
      key: paths.gallery(familyId),
      icon: <Image size={16} />,
      label: "Thư viện ảnh",
    },
  ];

  const selectedKey = location.pathname;

  const isActive = (key: string) => selectedKey === key;

  const handleNavigate = (key: string) => {
    if (key !== "family-diagram") {
      navigate(key);
      setMobileOpen(false);
    }
  };

  const navLinkCls = (key: string) =>
    `inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${
      isActive(key)
        ? "text-amber-600 bg-amber-50"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
    }`;

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
          <div className="hidden md:flex items-center gap-1">
            {menuItems.map((item) =>
              item.children ? (
                <DropdownMenu key={item.key}>
                  <DropdownMenuTrigger asChild>
                    <button
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer border-none bg-transparent ${
                        item.children.some((c) => isActive(c.key))
                          ? "text-amber-600 bg-amber-50"
                          : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {item.icon}
                      {item.label}
                      <ChevronDown size={14} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="min-w-40">
                    {item.children.map((child) => (
                      <DropdownMenuItem
                        key={child.key}
                        className={`gap-2 cursor-pointer ${isActive(child.key) ? "text-amber-600 bg-amber-50" : ""}`}
                        onClick={() => handleNavigate(child.key)}
                      >
                        {child.icon}
                        {child.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={item.key}
                  to={item.key}
                  className={navLinkCls(item.key)}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ),
            )}

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:text-red-600 hover:bg-red-50 transition cursor-pointer border-none bg-transparent ml-2"
              >
                <LogOut size={16} />
                Đăng xuất
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-bold text-white bg-linear-to-r from-amber-500 to-orange-600 shadow-md shadow-amber-500/20 hover:shadow-amber-500/35 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer border-none ml-2"
              >
                <LogIn size={16} />
                Đăng nhập
              </button>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border-none bg-transparent cursor-pointer text-gray-600 hover:bg-gray-100 transition"
            onClick={() => setMobileOpen(true)}
            title="Mở menu"
          >
            <AlignJustify size={22} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="right" className="w-65 p-0">
          <SheetHeader className="px-4 pt-4 pb-2">
            <SheetTitle className="font-bold text-base bg-linear-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Gia Phả Online
            </SheetTitle>
          </SheetHeader>
          <div className="flex flex-col py-2">
            {menuItems.map((item) =>
              item.children ? (
                <div key={item.key}>
                  <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                    {item.label}
                  </div>
                  {item.children.map((child) => (
                    <SheetClose key={child.key} asChild>
                      <button
                        className={`flex items-center gap-2.5 w-full px-6 py-2.5 text-sm font-medium border-none bg-transparent cursor-pointer transition-colors text-left ${
                          isActive(child.key)
                            ? "text-amber-600 bg-amber-50"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}
                        onClick={() => handleNavigate(child.key)}
                      >
                        {child.icon}
                        {child.label}
                      </button>
                    </SheetClose>
                  ))}
                </div>
              ) : (
                <SheetClose key={item.key} asChild>
                  <button
                    className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium border-none bg-transparent cursor-pointer transition-colors text-left ${
                      isActive(item.key)
                        ? "text-amber-600 bg-amber-50"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                    onClick={() => handleNavigate(item.key)}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                </SheetClose>
              ),
            )}

            <div className="border-t border-gray-100 mt-2 pt-2 px-4">
              {isLoggedIn ? (
                <SheetClose asChild>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-0 py-2.5 text-sm font-semibold text-red-500 hover:text-red-600 border-none bg-transparent cursor-pointer transition-colors"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </button>
                </SheetClose>
              ) : (
                <SheetClose asChild>
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 w-full px-0 py-2.5 text-sm font-bold text-amber-600 border-none bg-transparent cursor-pointer transition-colors"
                  >
                    <LogIn size={16} />
                    Đăng nhập
                  </button>
                </SheetClose>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default Navbar;
