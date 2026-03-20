"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useRef, useEffect, useState } from "react";
import { SendHorizonal, Loader2, Bot, User } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";

const transport = new DefaultChatTransport({
  api: "/api/chat",
});

export default function AIChat() {
  const { messages, sendMessage, status, error } = useChat({
    transport,
  });

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isLoading = status === "submitted" || status === "streaming";

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    sendMessage({ text: trimmed });
    setInput("");
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 space-y-4"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-brand-grey/30">
            <Bot size={48} strokeWidth={1} />
            <p className="mt-4 font-sans text-sm">
              Ask about products, orders, inventory, or sales.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="shrink-0 w-7 h-7 rounded-full bg-brand-orange/20 flex items-center justify-center mt-0.5">
                <Bot size={14} className="text-brand-orange" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded px-4 py-3 font-sans text-sm leading-relaxed ${
                message.role === "user"
                  ? "bg-brand-orange/15 text-brand-grey"
                  : "bg-brand-grey/5 text-brand-grey/90"
              }`}
            >
              {message.parts.map((part, i) => {
                if (part.type === "text") {
                  return (
                    <div
                      key={i}
                      className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-table:text-xs prose-th:text-brand-grey/60 prose-td:text-brand-grey/80 prose-headings:text-brand-grey prose-strong:text-brand-grey"
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(formatMarkdown(part.text)),
                      }}
                    />
                  );
                }
                // Tool parts: tool-<toolName> pattern (AI SDK v6)
                if (part.type.startsWith("tool-")) {
                  const toolPart = part as { type: string; state: string };
                  if (
                    toolPart.state === "output-available" ||
                    toolPart.state === "output-error"
                  ) {
                    return null;
                  }
                  const toolName = part.type.replace("tool-", "");
                  return (
                    <div
                      key={i}
                      className="text-xs text-brand-grey/30 italic my-1"
                    >
                      Looking up {formatToolName(toolName)}...
                    </div>
                  );
                }
                return null;
              })}
            </div>

            {message.role === "user" && (
              <div className="shrink-0 w-7 h-7 rounded-full bg-brand-grey/10 flex items-center justify-center mt-0.5">
                <User size={14} className="text-brand-grey/50" />
              </div>
            )}
          </div>
        ))}

        {/* Streaming indicator */}
        {status === "submitted" && (
          <div className="flex gap-3">
            <div className="shrink-0 w-7 h-7 rounded-full bg-brand-orange/20 flex items-center justify-center">
              <Bot size={14} className="text-brand-orange" />
            </div>
            <div className="flex items-center gap-2 text-brand-grey/40 text-sm font-sans">
              <Loader2 size={14} className="animate-spin" />
              Thinking...
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="mx-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm font-sans">
            {error.message || "Something went wrong. Try again."}
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-brand-grey/10 px-4 py-3"
      >
        <div className="flex items-center gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about products, orders, inventory..."
            disabled={isLoading}
            className="flex-1 bg-brand-grey/5 border border-brand-grey/10 rounded px-4 py-2.5 font-sans text-sm text-brand-grey placeholder:text-brand-grey/30 focus:outline-none focus:border-brand-orange/50 disabled:opacity-50 transition-colors"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="shrink-0 w-10 h-10 flex items-center justify-center bg-brand-orange hover:bg-brand-orange/90 disabled:bg-brand-grey/10 disabled:text-brand-grey/20 text-white rounded transition-colors"
          >
            {isLoading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <SendHorizonal size={16} />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

/** Convert camelCase tool names to readable labels. */
function formatToolName(name: string): string {
  return name.replace(/([A-Z])/g, " $1").toLowerCase().trim();
}

/** Minimal markdown to HTML for chat messages. Handles tables, bold, inline code, headings, and lists. */
function formatMarkdown(text: string): string {
  const lines = text.split("\n");
  let html = "";
  let inTable = false;
  let headerDone = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith("|") && line.endsWith("|")) {
      const cells = line
        .slice(1, -1)
        .split("|")
        .map((c) => c.trim());

      const nextLine = lines[i + 1]?.trim();
      const isSeparator = nextLine && /^\|[\s\-:|]+\|$/.test(nextLine);

      if (!inTable) {
        html += "<table>";
        inTable = true;
        headerDone = false;
      }

      if (isSeparator && !headerDone) {
        html += "<thead><tr>";
        cells.forEach((c) => (html += `<th>${inlineFormat(c)}</th>`));
        html += "</tr></thead><tbody>";
        headerDone = true;
        i++;
      } else if (/^[\s\-:|]+$/.test(cells.join(""))) {
        continue;
      } else {
        html += "<tr>";
        cells.forEach((c) => (html += `<td>${inlineFormat(c)}</td>`));
        html += "</tr>";
      }
    } else {
      if (inTable) {
        html += "</tbody></table>";
        inTable = false;
        headerDone = false;
      }
      if (line === "") {
        html += "<br />";
      } else if (line.startsWith("### ")) {
        html += `<h3>${inlineFormat(line.slice(4))}</h3>`;
      } else if (line.startsWith("## ")) {
        html += `<h2>${inlineFormat(line.slice(3))}</h2>`;
      } else if (line.startsWith("# ")) {
        html += `<h1>${inlineFormat(line.slice(2))}</h1>`;
      } else if (line.startsWith("- ") || line.startsWith("* ")) {
        html += `<li>${inlineFormat(line.slice(2))}</li>`;
      } else {
        html += `<p>${inlineFormat(line)}</p>`;
      }
    }
  }

  if (inTable) {
    html += "</tbody></table>";
  }

  return html;
}

function inlineFormat(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}
