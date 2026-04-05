import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { type Conversation, bankingStore } from "../../store/bankingStore";

const AUTO_REPLIES = [
  "Thank you for contacting Chase Microfinance Bank! I'm reviewing your message now.",
  "I understand your concern. Our team will look into this right away.",
  "Your account is secure and all transactions are monitored 24/7.",
  "For urgent matters, please also call our hotline: 1-800-CHASE-MF",
  "Is there anything else I can help you with today?",
  "I've escalated this to our specialist team. You'll hear back within 24 hours.",
  "Thank you for your patience! We appreciate your continued trust in Chase Microfinance Bank.",
];

export function ChatWidget() {
  const { session } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!session) return;
    const conv = bankingStore.getOrCreateConversation(session.username);
    setConversation(conv);
  }, [session]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(
        () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
        50,
      );
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  function handleSend() {
    if (!message.trim() || !conversation || !session) return;

    bankingStore.sendChatMessage(
      conversation.id,
      session.username,
      session.username,
      message.trim(),
      false,
    );
    const newConv = bankingStore.getOrCreateConversation(session.username);
    setConversation({ ...newConv });
    setMessage("");

    setIsTyping(true);
    const convId = conversation.id;
    setTimeout(
      () => {
        const reply =
          AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
        bankingStore.sendChatMessage(
          convId,
          "support",
          "Chase Support",
          reply,
          true,
        );
        const latest = bankingStore.getOrCreateConversation(session.username);
        setConversation({ ...latest });
        setIsTyping(false);
      },
      1200 + Math.random() * 800,
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  if (!session) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            data-ocid="chat.panel"
            className="w-80 h-[420px] bg-card border border-border rounded-2xl shadow-card-hover flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-brand/10 to-chart-2/10 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand/20 flex items-center justify-center">
                  <MessageCircle className="w-4 h-4 text-brand" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Chase Support
                  </p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    <span className="text-xs text-success">Online</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-ocid="chat.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-[10px] font-bold text-brand">CS</span>
                </div>
                <div className="bg-secondary rounded-xl rounded-tl-sm px-3 py-2 max-w-[220px]">
                  <p className="text-xs text-foreground">
                    Hi {session.username}! 👋 Welcome to Chase Support. How can
                    I help you today?
                  </p>
                </div>
              </div>

              {conversation?.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex items-end gap-2",
                    msg.isSupport ? "justify-start" : "justify-end",
                  )}
                >
                  {msg.isSupport && (
                    <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-[10px] font-bold text-brand">
                        CS
                      </span>
                    </div>
                  )}
                  <div
                    className={cn(
                      "px-3 py-2 rounded-xl max-w-[220px]",
                      msg.isSupport
                        ? "bg-secondary rounded-tl-sm"
                        : "bg-brand rounded-tr-sm",
                    )}
                  >
                    <p
                      className={cn(
                        "text-xs",
                        msg.isSupport
                          ? "text-foreground"
                          : "text-brand-foreground",
                      )}
                    >
                      {msg.message}
                    </p>
                    <p
                      className={cn(
                        "text-[10px] mt-1",
                        msg.isSupport
                          ? "text-muted-foreground"
                          : "text-brand-foreground/70",
                      )}
                    >
                      {formatDistanceToNow(new Date(msg.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[10px] font-bold text-brand">CS</span>
                  </div>
                  <div className="bg-secondary rounded-xl rounded-tl-sm px-3 py-2">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="px-3 py-3 border-t border-border">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  data-ocid="chat.input"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a message..."
                  className="h-9 text-xs rounded-xl"
                />
                <Button
                  size="icon"
                  data-ocid="chat.send_button"
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className="w-9 h-9 flex-shrink-0 bg-brand hover:bg-brand/90 text-brand-foreground rounded-xl"
                >
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        data-ocid="chat.open_modal_button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-brand hover:bg-brand/90 shadow-glow flex items-center justify-center transition-colors relative"
        aria-label="Open support chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-5 h-5 text-brand-foreground" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-5 h-5 text-brand-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
