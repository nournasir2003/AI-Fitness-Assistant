// src/app/assignments/workout-planner/[conversationId]/page.tsx
import ChatContainer from "@/components/chat/ChatContainer";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  return <ChatContainer conversationId={conversationId} />;
}
