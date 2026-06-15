import { Outlet } from "react-router-dom";
import { Topbar, Sidebar } from "../common/Navbar";
import { useState } from "react";

export const AppLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface-950">
      {/* <Topbar toggleSidebar={toggleSidebar} /> */}

      {/* Main content area */}
      <div className="flex flex-1 min-w-0 overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
