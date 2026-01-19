import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
     <>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />        
       <div className="flex-1 pl-0 md:pl-64 overflow-auto">
           <Outlet />
       </div>        
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
