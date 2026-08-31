import AdminSidebar from "./AdminSideBar/AdminSideBar";
import { Outlet, Navigate } from "react-router-dom";
import "./AdminLayout.css";

export default function AdminLayout() {
  const adminToken = localStorage.getItem("admin_access");

  if (!adminToken) {
    return <Navigate to="/AdminLogin" replace />;
  }

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}
