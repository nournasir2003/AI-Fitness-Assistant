// src/app/assignments/layout.tsx
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function AssignmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
