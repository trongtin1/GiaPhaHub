import { Outlet } from "react-router-dom";
import Navbar from "./partie/Navbar";
import Footer from "./partie/Footer";

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
