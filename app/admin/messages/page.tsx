"use client";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/components/Toast";

const delay = () => new Promise((r) => setTimeout(r, 800));

interface AdminMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  sentAt: string;
  isAdmin: boolean;
}

interface AdminConversation {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  messages: AdminMessage[];
}

const MOCK_ADMIN_CONVERSATIONS: AdminConversation[] = [
  {
    id: "ac1", userId: "u1", userName: "Alex Rivera", userEmail: "alex@campus.edu",
    lastMessage: "My listing was rejected but I don't understand why.", lastMessageAt: "2024-11-15T14:30:00Z", unreadCount: 2,
    messages: [
      { id: "m1", senderId: "u1", senderName: "Alex Rivera", content: "Hi, my listing was rejected but I don't understand why.", sentAt: "2024-11-15T14:00:00Z", isAdmin: false },
      { id: "m2", senderId: "u1", senderName: "Alex Rivera", content: "Can you please explain?", sentAt: "2024-11-15T14:30:00Z", isAdmin: false },
    ],
  },
  {
    id: "ac2", userId: "u4", userName: "Maria Santos", userEmail: "maria@campus.edu",
    lastMessage: "Thank you for resolving my dispute!", lastMessageAt: "2024-11-14T10:00:00Z", unreadCount: 0,
    messages: [
      { id: "m3", senderId: "admin1", senderName: "Shopora Admin", content: "We have reviewed your dispute and issued a full refund.", sentAt: "2024-11-14T09:00:00Z", isAdmin: true },
      { id: "m4", senderId: "u4", senderName: "Maria Santos", content: "Thank you for resolving my dispute!", sentAt: "2024-11-14T10:00:00Z", isAdmin: false },
    ],
  },
  {
    id: "ac3", userId: "u5", userName: "Carlo Reyes", userEmail: "carlo@campus.edu",
    lastMessage: "How do I verify my account?", lastMessageAt: "2024-11-13T16:00:00Z", unreadCount: 1,
    messages: [
      { id: "m5", senderId: "u5", senderName: "Carlo Reyes", content: "How do I verify my account?", sentAt: "2024-11-13T16:00:00Z", isAdmin: false },
    ],
  },
];

export default function AdminMessagesPage() {
  const { showToast } = useToast();
  const [conversations, setConversations] = useState<AdminConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<AdminConversation | null>(null);
  const [reply, setReply] = useState("");
  const [replyError, setReplyError] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    delay().then(() => { setConversations(MOCK_ADMIN_CONVERSATIONS); setLoading(false); });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selected?.messages.length]);

  const handleSelect = (conv: AdminConversation) => {
    setConversations((prev) => prev.map((c) => c.id === conv.id ? { ...c, unreadCount: 0 } : c));
    setSelected({ ...conv, unreadCount: 0 });
    setReply("");
    setReplyError("");
  };

  const handleSend = async () => {
    if (!reply.trim()) { setReplyError("Message cannot be empty."); return; }
    if (!selected) return;
    setSending(true);
    await delay();
    const newMsg: AdminMessage = {
      id: `m${Date.now()}`, senderId: "admin1", senderName: "Shopora Admin",
      content: reply.trim(), sentAt: new Date().toISOString(), isAdmin: true,
    };
    const updated = { ...selected, messages: [...selected.messages, newMsg], lastMessage: reply.trim(), lastMessageAt: newMsg.sentAt };
    setSelected(updated);
    setConversations((prev) => prev.map((c) => c.id === selected.id ? updated : c));
    setReply("");
    setReplyError("");
    setSending(false);
    showToast("Reply sent.", "success");
  };

  return (
    <div className="flex gap-5 h-[calc(100vh-8rem)] animate-fade-in">
      {/* Conversation list */}
      <div className="w-72 shrink-0 bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-slate-100">
          <p className="text-sm font-semibold text-slate-700">Inbox</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}</div>
          ) : conversations.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No messages.</p>
          ) : (
            conversations.map((conv) => (
              <button key={conv.id} onClick={() => handleSelect(conv)}
                className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors ${selected?.id === conv.id ? "bg-violet-50 border-l-2 border-l-violet-500" : ""}`}>
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-medium text-slate-800 truncate">{conv.userName}</span>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-violet-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">{conv.unreadCount}</span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate">{conv.lastMessage}</p>
                <p className="text-[10px] text-slate-300 mt-0.5">{new Date(conv.lastMessageAt).toLocaleString()}</p>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Thread view */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl flex flex-col overflow-hidden">
        {!selected ? (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Select a conversation</div>
        ) : (
          <>
            <div className="px-5 py-3 border-b border-slate-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm font-bold">
                {selected.userName.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{selected.userName}</p>
                <p className="text-xs text-slate-400">{selected.userEmail}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {selected.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isAdmin ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${msg.isAdmin ? "bg-violet-600 text-white rounded-br-sm" : "bg-slate-100 text-slate-800 rounded-bl-sm"}`}>
                    <p>{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${msg.isAdmin ? "text-violet-200" : "text-slate-400"}`}>{new Date(msg.sentAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="px-5 py-4 border-t border-slate-100">
              <div className="flex gap-2">
                <div className="flex-1">
                  <textarea value={reply} onChange={(e) => { setReply(e.target.value); setReplyError(""); }}
                    placeholder="Type a reply..." rows={2}
                    className={`w-full text-sm border rounded-xl px-3 py-2 text-slate-700 resize-none focus:outline-none focus:border-violet-400 ${replyError ? "border-red-400" : "border-slate-200"}`} />
                  {replyError && <p className="text-xs text-red-500 mt-1">{replyError}</p>}
                </div>
                <button onClick={handleSend} disabled={sending}
                  className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-xl transition-colors disabled:opacity-50 self-start mt-0.5">
                  {sending ? "..." : "Send"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
