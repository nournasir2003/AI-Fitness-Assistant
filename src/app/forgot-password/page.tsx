// src/app/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSent(true);
    } catch (err: any) {
      switch (err.code) {
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;
        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;
        case "auth/user-not-found":
          // Don't reveal whether the account exists
          setSent(true);
          break;
        default:
          setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto py-16 px-4 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="space-y-2">
        <h1>Reset your password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a link to reset your
          password.
        </p>
      </div>

      {sent ? (
        <div className="rounded-xl border border-brand/30 bg-brand/5 p-4 text-sm space-y-2">
          <p>
            If an account exists for <strong>{email}</strong>, a reset link is
            on its way. Check your spam folder too.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            dir="auto"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20"
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full bg-brand hover:bg-brand/90 text-brand-foreground"
          >
            {loading ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      )}

      <Link
        href="/login"
        className="block text-center text-sm text-muted-foreground hover:text-brand transition-colors"
      >
        Back to log in
      </Link>
    </div>
  );
}
