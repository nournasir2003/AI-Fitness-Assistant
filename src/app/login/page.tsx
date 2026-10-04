// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { logIn } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await logIn(email, password);
      router.push("/assignments");
    } catch (err: any) {
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found"
      ) {
        setError("Email or password is incorrect");
      } else {
        setError("An error occurred, please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-xl shadow-black/5">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-4">
              <span className="w-3 h-3 rounded-full bg-brand" />
            </div>

            <h1 className="text-3xl font-bold tracking-tight">Login</h1>

            <p className="text-base text-muted-foreground mt-2">
              Welcome back, please login to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-base font-medium">
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-base font-medium">
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </div>

            {error && (
              <p className="text-base text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3 animate-in fade-in duration-200">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-base font-medium bg-brand hover:bg-brand/90 text-brand-foreground shadow-md shadow-brand/25 disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>

          <div className="mt-7 space-y-2 text-center">
            <p className="text-sm text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="text-brand hover:underline font-semibold"
              >
                Create one
              </Link>
            </p>
            <p className="text-sm text-muted-foreground">
              <Link
                href="/forgot-password"
                className="text-brand hover:underline font-semibold"
              >
                Forgot password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
