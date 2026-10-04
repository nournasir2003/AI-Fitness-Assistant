// src/components/auth/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { logOut } from "@/lib/firebase/auth";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await logOut();
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-sm text-gray-600 hover:text-black"
    >
      Logout
    </button>
  );
}
