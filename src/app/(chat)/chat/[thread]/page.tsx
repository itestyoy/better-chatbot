import { selectThreadWithMessagesAction } from "@/app/api/chat/actions";
import ChatBot from "@/components/chat-bot";

import { ChatMessage, ChatThread } from "app-types/chat";
import { redirect, RedirectType } from "next/navigation";

import { NEXT_PUBLIC_BASE_PATH } from "lib/const";

const fetchThread = async (
  threadId: string,
): Promise<(ChatThread & { messages: ChatMessage[] }) | null> => {
  return await selectThreadWithMessagesAction(threadId);
};

export default async function Page({
  params,
}: { params: Promise<{ thread: string }> }) {
  const { thread: threadId } = await params;

  const thread = await fetchThread(threadId);

  if (!thread) redirect(NEXT_PUBLIC_BASE_PATH + "/", RedirectType.replace);

  return <ChatBot threadId={threadId} initialMessages={thread.messages} />;
}
