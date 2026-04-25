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
  "AI Implementation Consultation ($1,000)",
  "Photo Booth Consulting",
  "Website / SEO Consultation",
  "Security Audit Consultation",
  "Custom Dashboard Build",
  "Other",
];

export function ConsultationForm() {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    service: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", company: "", service: "", message: "" });
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
        <p className="font-mono text-sm text-terminal">$ echo "received"</p>
        <p className="mt-2 text-muted-foreground">
          Got it. I&apos;ll be in touch within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" id="consultation">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Name
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-data focus:outline-none"
            placeholder="Andrew Webber"
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
            className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-data focus:outline-none"
            placeholder="you@company.com"
          />
        </div>
      </div>

      <div>
        <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Company
        </label>
        <input
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-data focus:outline-none"
          placeholder="Optional"
        />
      </div>

      <div>
        <label className="mb-1 block font-mono text-xs uppercase tracking-wider text-muted-foreground">
          Service
        </label>
        <select
          required
          value={form.service}
          onChange={(e) => setForm({ ...form, service: e.target.value })}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-data focus:outline-none"
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
          Tell me about your project
        </label>
        <textarea
          required
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          rows={4}
          className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-data focus:outline-none"
          placeholder="What are you looking to build or solve?"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className={cn(
          "w-full rounded-md bg-data/10 py-3 font-mono text-sm uppercase tracking-wider text-data transition-colors hover:bg-data/20",
          status === "sending" && "animate-pulse opacity-50"
        )}
      >
        {status === "sending" ? "Sending..." : "Submit Inquiry →"}
      </button>

      {status === "error" && (
        <p className="text-center text-xs text-destructive">
          Something went wrong. Try again or email directly.
        </p>
      )}
    </form>
  );
}
