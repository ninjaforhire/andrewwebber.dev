"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-terminal/30 bg-terminal/5 p-8 text-center">
        <p className="font-mono text-sm text-terminal">$ echo &quot;message sent&quot;</p>
        <p className="mt-2 text-muted-foreground">
          Thanks for reaching out. I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" id="contact">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Name
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-creative focus:outline-none"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Email
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-creative focus:outline-none"
            placeholder="you@email.com"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Message
        </label>
        <textarea
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={4}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-creative focus:outline-none"
          placeholder="What's on your mind?"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className={cn(
          "w-full rounded-md bg-creative/10 py-3 font-mono text-sm uppercase tracking-wider text-creative transition-colors hover:bg-creative/20",
          status === "sending" && "animate-pulse opacity-50"
        )}
      >
        {status === "sending" ? "Sending..." : "Send Message →"}
      </button>

      {status === "error" && (
        <p className="text-center text-xs text-destructive">
          Something went wrong. Try again.
        </p>
      )}
    </form>
  );
}
