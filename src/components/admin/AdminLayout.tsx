import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export function AdminLayout() {
  return (
    <div className="flex h-screen bg-slate-900 text-white">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
