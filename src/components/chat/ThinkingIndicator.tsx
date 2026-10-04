// src/components/chat/ThinkingIndicator.tsx
export default function ThinkingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3 w-fit rounded-2xl rounded-bl-sm bg-card border border-border animate-in fade-in duration-300">
      <span className="w-2 h-2 rounded-full bg-brand animate-bounce [animation-delay:-0.3s]" />
      <span className="w-2 h-2 rounded-full bg-brand animate-bounce [animation-delay:-0.15s]" />
      <span className="w-2 h-2 rounded-full bg-brand animate-bounce" />
    </div>
  );
}
