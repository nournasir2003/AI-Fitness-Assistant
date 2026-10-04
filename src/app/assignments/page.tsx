// src/app/assignments/page.tsx
import Link from "next/link";

const assignments = [
  {
    slug: "workout-planner",
    title: "Smart Workout Plan Generator",
    description:
      "A streaming chat for creating personalized workout plans based on user constraints",
  },
];
export default function AssignmentsPage() {
  return (
    <div className="max-w-2xl mx-auto py-10 px-4 space-y-4">
      <h1 className="text-2xl font-medium">Generate My Plan</h1>
      {assignments.map((a) => (
        <Link
          key={a.slug}
          href={`/assignments/${a.slug}`}
          className="group block border border-border rounded-xl p-4 transition-colors hover:border-brand/40 hover:bg-brand/5"
        >
          <h2 className="font-medium transition-colors group-hover:text-brand">
            {a.title}
          </h2>
          <p className="text-sm text-muted-foreground">{a.description}</p>
        </Link>
      ))}
    </div>
  );
}
