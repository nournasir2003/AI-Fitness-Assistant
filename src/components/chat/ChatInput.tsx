// src/components/chat/ChatInput.tsx
import { Button } from "@/components/ui/button";
import { Send, Square } from "lucide-react";

export default function ChatInput({
  input,
  onChange,
  onSubmit,
  isStreaming,
  onStop,
}: {
  input: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isStreaming: boolean;
  onStop: () => void;
}) {
  return (
    <form onSubmit={onSubmit} className="flex items-center gap-2 p-3">
      <input
        dir="auto"
        value={input}
        onChange={onChange}
        placeholder="Type your message..."
        disabled={isStreaming}
        className="flex-1 rounded-full border border-border bg-card/50 backdrop-blur-md px-4 py-2.5 text-sm outline-none transition-all focus:border-brand focus:ring-2 focus:ring-brand/20 disabled:opacity-50"
      />

      {isStreaming ? (
        <Button
          type="button"
          onClick={onStop}
          size="icon"
          variant="destructive"
          className="rounded-full shrink-0 animate-in zoom-in duration-200"
        >
          <Square className="w-4 h-4" />
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={!input.trim()}
          size="icon"
          className="rounded-full shrink-0 bg-brand hover:bg-brand/90 text-brand-foreground shadow-md shadow-brand/25 disabled:opacity-40 disabled:shadow-none transition-all"
        >
          <Send className="w-4 h-4" />
        </Button>
      )}
    </form>
  );
}
