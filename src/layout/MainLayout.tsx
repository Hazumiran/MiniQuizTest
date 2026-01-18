import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <>
        <Sidebar />
        <div className="flex-1 pl-0 md:pl-64">
            <Outlet />
        </div>
        <Footer />
    </>
  );
};

export default MainLayout;
