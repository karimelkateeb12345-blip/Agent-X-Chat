"use client";

import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const WELCOME =
  "أهلاً، قول لي اسم السلسلة اللي عايز تدور فيها (Bratty Sis, Moms Teach Sex, Family Strokes, Daughter Swap...) وإيه اللي محتاجه: اقتراحات؟ عنوان معين؟ أحدث الحلقات؟";

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: WELCOME },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply || "مفيش رد حالياً، جرب تاني.",
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "حصل خطأ في الاتصال. جرب تاني بعد شوية.",
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-10">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-600 to-purple-700 flex items-center justify-center text-lg font-bold shadow-lg">
          X
        </div>
        <div>
          <h1 className="font-semibold text-lg leading-tight">Agent X</h1>
          <p className="text-xs text-zinc-400">وكيل بحث السلاسل الإباحية</p>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"} animate-fade-in`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === "user"
                  ? "bg-zinc-800 text-zinc-100 rounded-br-md"
                  : "bg-gradient-to-br from-rose-900/60 to-purple-900/60 border border-rose-800/40 text-zinc-50 rounded-bl-md"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-end animate-fade-in">
            <div className="bg-zinc-800/80 rounded-2xl rounded-bl-md px-4 py-3 text-sm text-zinc-400 flex gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce [animation-delay:0.1s]">.</span>
              <span className="animate-bounce [animation-delay:0.2s]">.</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      {/* Input */}
      <footer className="border-t border-zinc-800 bg-zinc-900/90 p-4">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="اكتب اسم السلسلة أو طلبك هنا..."
            rows={1}
            className="flex-1 resize-none bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-600/50 placeholder:text-zinc-500 max-h-32"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-700 disabled:text-zinc-500 text-white rounded-xl px-5 py-3 font-medium transition-colors shrink-0"
          >
            إرسال
          </button>
        </div>
        <p className="text-[11px] text-zinc-500 mt-2 text-center">
          محاكاة بحث • المحتوى للبالغين فقط • 18+
        </p>
      </footer>
    </div>
  );
}
