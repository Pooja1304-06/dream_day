import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function AdminRoute() {

  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {

    async function verifyAdmin() {

      try {

        const response = await fetch(
          `${API}/admin/auth/me`,
          {
            credentials: "include"
          }
        );

        if (!response.ok) {
          throw new Error("Admin session not valid");
        }

        setAuthenticated(true);

      } catch {

        setAuthenticated(false);

      } finally {

        setLoading(false);

      }

    }

    verifyAdmin();

  }, []);

  if (loading) {
    return (
      <div className="page-center">
        Loading admin dashboard...
      </div>
    );
  }

  return authenticated
    ? <Outlet />
    : <Navigate to="/admin/login" replace />;

}