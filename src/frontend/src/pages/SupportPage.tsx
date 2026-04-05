import { MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import React from "react";
import { useAuth } from "../contexts/AuthContext";

export default function SupportPage() {
  const { session } = useAuth();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-xl bg-brand/15 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-brand" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Support</h1>
          <p className="text-sm text-muted-foreground">
            Get help from our support team
          </p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-card border border-border rounded-xl p-8 shadow-card text-center max-w-lg mx-auto"
      >
        <div className="w-16 h-16 rounded-2xl bg-brand/10 flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-brand" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Live Chat Support
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Hi {session?.username}! Our support team is available 24/7. Click the
          chat bubble in the bottom right corner to start a conversation.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-success font-medium">
            Support agents are online
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
          {[
            { label: "Response Time", value: "< 2 min", sub: "average" },
            { label: "Availability", value: "24/7", sub: "always online" },
            { label: "Satisfaction", value: "98%", sub: "customer rating" },
          ].map((stat) => (
            <div key={stat.label} className="bg-muted/50 rounded-xl p-4">
              <p className="text-xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs font-medium text-foreground">
                {stat.label}
              </p>
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
