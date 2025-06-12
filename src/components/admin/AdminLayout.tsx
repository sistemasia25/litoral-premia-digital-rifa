
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-slate-900 text-white">
      <Sidebar />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto ml-0 md:ml-0">
        <div className="pt-12 md:pt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
