// src/components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { logOut } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";
import ConversationsMenu from "./ConversationsMenu";

export default function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logOut();
    router.push("/");
  };

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "";

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg"
        >
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          AI Fitness Assistant
        </Link>

        <div className="hidden sm:flex items-center gap-6 text-sm text-muted-foreground">
          <Link
            href="/assignments"
            className="hover:text-foreground transition-colors"
          >
            Start Your Plan
          </Link>

          {!loading && !user && (
            <Link
              href="/trial"
              className="hover:text-foreground transition-colors"
            >
              Free Trial
            </Link>
          )}

          {/*<Link href="/conversations">My Chats</Link>*/}
          {!loading && user && <ConversationsMenu />}
        </div>

        <div className="flex items-center gap-3">
          {loading ? (
            <div className="w-8 h-8 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            <div className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-full bg-brand text-brand-foreground flex items-center justify-center text-xs font-medium"
                title={user.email ?? ""}
              >
                {initials}
              </div>
              <Button onClick={handleLogout} variant="outline" size="sm">
                Log Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="sm"
                  className="bg-brand hover:bg-brand/90 text-brand-foreground shadow-md shadow-brand/20"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
