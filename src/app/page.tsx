"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { generateBotResponse } from "@/lib/generate-response";

type Sender = "user" | "bot";

type ChatMessage = {
  id: string;
  sender: Sender;
  content: string;
  createdAt: number;
};

const initialBotMessage =
  "Namaste! 🙏 Welcome to Oven Bakery. Craving something sweet or spicy today? I can help you order!";

const createMessage = (sender: Sender, content: string): ChatMessage => ({
  id:
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 10),
  sender,
  content,
  createdAt: Date.now(),
});

const suggestedPrompts = [
  "Show me the menu",
  "Do you deliver to Pondha?",
  "Is everything eggless?",
  "Where is my order?",
];

const formatMessage = (text: string) => {
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const nodes: (string | { label: string; href: string })[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    nodes.push({ label: match[1], href: match[2] });
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
};

const MessageBubble = ({ message }: { message: ChatMessage }) => {
  const isBot = message.sender === "bot";
  const formatted = useMemo(() => formatMessage(message.content), [message]);
  const parts = formatted.flatMap((piece, index) => {
    if (typeof piece === "string") {
      return piece.split("\n").map((segment, segmentIndex, all) => (
        <span key={`${message.id}-text-${index}-${segmentIndex}`}>
          {segment}
          {segmentIndex < all.length - 1 ? <br /> : null}
        </span>
      ));
    }
    return (
      <a
        key={`${message.id}-link-${index}`}
        href={piece.href}
        className="font-semibold text-amber-700 underline underline-offset-2 hover:text-amber-800"
      >
        {piece.label}
      </a>
    );
  });

  return (
    <div
      className={`flex items-start gap-3 ${
        isBot ? "" : "flex-row-reverse text-right"
      }`}
    >
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full border ${
          isBot
            ? "border-amber-200 bg-amber-100 text-2xl"
            : "border-amber-300 bg-amber-200 text-lg"
        }`}
        aria-hidden
      >
        {isBot ? "🧁🎧" : "😊"}
      </div>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          isBot ? "bg-white text-amber-900" : "bg-amber-600 text-amber-50"
        }`}
      >
        {parts}
      </div>
    </div>
  );
};

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createMessage("bot", initialBotMessage),
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (content: string) => {
    if (!content.trim()) return;

    const userMessage = createMessage("user", content.trim());
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    const reply = generateBotResponse(content);
    const delay = Math.min(1200, 400 + content.length * 20);

    window.setTimeout(() => {
      setMessages((prev) => [...prev, createMessage("bot", reply)]);
      setIsTyping(false);
    }, delay);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10 text-amber-950">
      <main className="relative w-full max-w-3xl rounded-3xl bg-white/85 p-6 shadow-xl shadow-amber-200 backdrop-blur">
        <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 px-6 py-5 text-amber-50 shadow">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-4xl">
              🧁🎧
            </div>
            <div>
              <h1 className="text-lg font-semibold">Baker Bot</h1>
              <p className="text-sm text-amber-100">
                Oven Bakery · Gadwali Colony, Bhauwala
              </p>
            </div>
          </div>
          <span className="rounded-full bg-white/20 px-4 py-1 text-xs uppercase tracking-wide">
            Always eggless · Always fresh
          </span>
        </div>

        <section className="mt-6 flex max-h-[65vh] flex-col gap-4 overflow-y-auto pr-2 chat-scrollbar">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          {isTyping ? (
            <div className="flex items-center gap-3 text-amber-700">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-amber-200 bg-amber-100 text-2xl">
                🧁🎧
              </div>
              <div className="rounded-2xl bg-white px-4 py-3 text-sm shadow-sm">
                typing…
              </div>
            </div>
          ) : null}
          <div ref={chatEndRef} />
        </section>

        <section className="mt-4 flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="rounded-full border border-amber-200 bg-amber-100 px-4 py-1 text-xs font-medium text-amber-800 transition hover:bg-amber-200"
              onClick={() => sendMessage(prompt)}
            >
              {prompt}
            </button>
          ))}
        </section>

        <form
          onSubmit={handleSubmit}
          className="mt-4 flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3"
        >
          <input
            className="flex-1 bg-transparent text-sm text-amber-900 placeholder:text-amber-400 focus:outline-none"
            placeholder="Type your message here..."
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
          />
          <button
            type="submit"
            className="rounded-full bg-amber-600 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-amber-50 transition hover:bg-amber-700"
          >
            Send
          </button>
        </form>
      </main>
    </div>
  );
}
