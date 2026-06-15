"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  email: string;
  company: string;
  service: string;
  message: string;
}

const SERVICES = [
  "Software Build",
  "Brand + Design",
  "SEO Review / Report",
  "Competitor Intel Report",
  "Security / Vulnerability Scan",
  "Remote Server / DNS Setup",
  "IDE / Claude / AI Setup",
  "Ops Tool (Inbox Agent / W9 Generator)",
  "Consultation (10-min Discovery)",
  "Consultation (1-hr AMA)",
  "PDF Guide",
  "Other",
];

export function InquiryForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/photo-booth-owners/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", company: "", service: "", message: "" });
      } else {
        const data = await res.json().catch(() => ({}));
        setErrorMsg((data as { error?: string }).error ?? "Something went wrong.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-warm/30 bg-warm/5 p-8 text-center max-w-2xl">
        <p className="font-mono text-sm text-warm">$ echo &quot;received&quot;</p>
        <p className="mt-2 text-muted-foreground">Got it. I&apos;ll reply within 24 hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl" id="inquiry">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Name *
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-warm focus:outline-none"
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Email *
          </label>
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-warm focus:outline-none"
            placeholder="you@yourbooth.com"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Business Name
        </label>
        <input
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-warm focus:outline-none"
          placeholder="Optional"
        />
      </div>

      <div>
        <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
          What do you need? *
        </label>
        <select
          required
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-warm focus:outline-none"
        >
          <option value="">Select a service...</option>
          {SERVICES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Tell me what you&apos;re trying to solve *
        </label>
        <textarea
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={4}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-warm focus:outline-none"
          placeholder="What problem are you trying to solve? What have you already tried?"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className={cn(
          "w-full rounded-md bg-warm/10 py-3 font-mono text-sm uppercase tracking-wider text-warm transition-colors hover:bg-warm/20",
          status === "sending" && "animate-pulse opacity-50"
        )}
      >
        {status === "sending" ? "Sending..." : "Send Inquiry →"}
      </button>

      {status === "error" && (
        <p className="text-center text-xs text-destructive">
          {errorMsg || "Something went wrong. Email andrew@mightyphotobooths.com directly."}
        </p>
      )}
    </form>
  );
}
