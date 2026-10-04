// src/components/layout/ConversationsMenu.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  getUserConversations,
  type Conversation,
} from "@/lib/firebase/conversations";
import { Button } from "@/components/ui/button";
import { MessageSquare, Plus } from "lucide-react";

export default function ConversationsMenu() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !user) return;
    getUserConversations(user.uid).then(setConversations);
  }, [open, user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <Button variant="ghost" size="sm" onClick={() => setOpen(!open)}>
        <MessageSquare className="w-4 h-4 ml-1.5" />
        My Chats
      </Button>

      {open && (
        <div className="absolute left-0 mt-2 w-72 rounded-xl border border-border bg-card shadow-xl shadow-black/10 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <Link
            href="/assignments/workout-planner"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-sm text-brand hover:bg-muted/50 border-b border-border transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </Link>

          <div className="max-h-80 overflow-y-auto">
            {conversations.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-6 px-4">
                No previous chats found. Start a new conversation to see it
                here.
              </p>
            ) : (
              conversations.map((c) => (
                <Link
                  key={c.id}
                  href={`/assignments/workout-planner/${c.id}`}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm hover:bg-muted/50 transition-colors truncate border-b border-border last:border-0"
                >
                  {c.title}
                </Link>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
