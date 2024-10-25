// routes/admin/index.tsx
import { PageProps } from "$fresh/server.ts";
import AdminDashboard from "../../islands/AdminDashboard.tsx";

export default function AdminPage(props: PageProps) {
  return (
    <AdminDashboard />
  );
}