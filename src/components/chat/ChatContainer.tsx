// src/components/chat/ChatContainer.tsx
"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  createConversation,
  saveMessages,
  getConversationMessages,
} from "@/lib/firebase/conversations";
import MessageBubble from "./MessageBubble";
import ThinkingIndicator from "./ThinkingIndicator";
import ChatInput from "./ChatInput";
import { Button } from "@/components/ui/button";
import type { UIMessage } from "ai";

export default function ChatContainer({
  messageLimit,
  conversationId: initialConversationId,
}: {
  messageLimit?: number;
  conversationId?: string;
}) {
  const { user } = useAuth();
  const router = useRouter();

  const [conversationId, setConversationId] = useState(initialConversationId);
  //const [initialMessages, setInitialMessages] = useState<UIMessage[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(!!initialConversationId);

  const { messages, sendMessage, status, stop, setMessages } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const [input, setInput] = useState("");

  const isThinking = status === "submitted";
  const isStreaming = status === "streaming";

  const userMessageCount = messages.filter((m) => m.role === "user").length;
  const limitReached =
    messageLimit !== undefined && userMessageCount >= messageLimit;

  useEffect(() => {
    if (!initialConversationId) return;

    getConversationMessages(initialConversationId).then((msgs) => {
      setMessages(msgs);
      setLoadingHistory(false);
    });
  }, [initialConversationId, setMessages]);

  useEffect(() => {
    if (!user || messageLimit !== undefined) return;
    if (messages.length === 0 || status !== "ready") return;

    const persist = async () => {
      let id = conversationId;

      if (!id) {
        const firstUserMessage = messages.find((m) => m.role === "user");

        const firstText =
          firstUserMessage?.parts.find((p) => p.type === "text")?.text ??
          "New Chat";

        id = await createConversation(user.uid, firstText);
        setConversationId(id);

        router.replace(`/assignments/workout-planner/${id}`);
      }

      await saveMessages(id, messages);
    };

    persist();
  }, [messages, status, user, conversationId, messageLimit]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const [isPinned, setIsPinned] = useState(true);

  const handleScroll = () => {
    const distanceFromBottom =
      document.documentElement.scrollHeight -
      window.scrollY -
      window.innerHeight;
    setIsPinned(distanceFromBottom < 80);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isPinned) bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, isPinned]);

  const jumpToLatest = () => {
    setIsPinned(true);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || limitReached) return;
    sendMessage({ text: input });
    setInput("");
  };

  if (loadingHistory) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col max-w-2xl mx-auto">
      <div className="flex-1 px-3 py-4 space-y-3 sm:px-4">
        {messageLimit !== undefined && (
          <div className="text-xs text-center text-muted-foreground bg-muted/50 border border-border rounded-lg py-2 px-3 mb-2">
            Free Tier — {userMessageCount}/{messageLimit} Messages
          </div>
        )}

        {messages.map((m) => (
          <MessageBubble key={m.id} role={m.role} parts={m.parts} />
        ))}

        {isThinking && <ThinkingIndicator />}

        {limitReached && (
          <div className="rounded-2xl border border-brand/30 bg-brand/5 p-5 text-center space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <p className="text-sm font-medium">
              Free trial messages have been exhausted
            </p>
            <p className="text-xs text-muted-foreground">
              Sign up for a free account to continue without limits
            </p>
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-brand hover:bg-brand/90 text-brand-foreground shadow-md shadow-brand/25"
              >
                Sign Up for Free
              </Button>
            </Link>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {!isPinned && (
        <button
          onClick={jumpToLatest}
          className="sticky bottom-24 self-center mb-2 text-xs px-3 py-1 rounded-full bg-foreground text-background shadow-lg z-20"
        >
          ↓ Jump to Latest Message
        </button>
      )}

      {!limitReached && (
        <div className="sticky bottom-0 bg-gradient-to-t from-background via-background/60 to-transparent pt-4">
          <ChatInput
            input={input}
            onChange={(e) => setInput(e.target.value)}
            onSubmit={handleSubmit}
            isStreaming={isStreaming}
            onStop={stop}
          />
        </div>
      )}
    </div>
  );
}
