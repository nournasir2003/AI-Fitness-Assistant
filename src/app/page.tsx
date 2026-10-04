// src/app/page.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand/30 bg-brand/10 text-sm text-brand">
          <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
          AI Front-End Toolkit
        </div>

        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground to-brand bg-clip-text text-transparent">
          FlyRank Capstone
        </h1>

        <p className="text-lg text-muted-foreground max-w-lg mx-auto leading-relaxed">
          AI Front-End Toolkit, built with Next.js and integrated with
          artificial intelligence
        </p>

        <div className="flex gap-4 justify-center pt-4">
          <Link href="/trial">
            <Button
              size="lg"
              className="bg-brand hover:bg-brand/90 text-brand-foreground shadow-lg shadow-brand/25 transition-all hover:shadow-brand/40 hover:-translate-y-0.5"
            >
              Start Planning
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="transition-all hover:-translate-y-0.5"
            >
              Login
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
