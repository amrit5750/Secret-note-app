"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StatsPanel from "@/components/StatsPanel";
import { useState } from "react";

type Status = {
  type: "idle" | "submitting" | "success" | "error";
  msg?: string;
};

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState(""); // honeypot
  const [status, setStatus] = useState<Status>({ type: "idle" });

  const emailOk = (v: string) => /\S+@\S+\.\S+/.test(v);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (hp) return;
    if (!name.trim() || !emailOk(email) || !message.trim()) {
      setStatus({ type: "error", msg: "Please fill all fields correctly." });
      return;
    }

    try {
      setStatus({ type: "submitting" });
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, message }),
        }
      );
      if (!res.ok) throw new Error();
      setStatus({
        type: "success",
        msg: "Thanks! We'll get back to you soon.",
      });
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus({
        type: "error",
        msg: "Something went wrong. Please try again in a moment.",
      });
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0D1220] text-[#E7EDF7]">
        <section className="w-full max-w-3xl mx-auto px-4 pt-16 pb-24">
          <div className="rounded-2xl border border-white/10 bg-[#141B2B] shadow-xl">
            <div className="px-6 py-4 border-b border-white/10 rounded-t-2xl bg-[#111827]/40">
              <h1 className="text-xl sm:text-2xl font-semibold">Contact Us</h1>
              <p className="text-xs text-[#A0AEC0] mt-1">
                We typically reply within 1–2 business days.
              </p>
            </div>

            <form onSubmit={onSubmit} className="px-6 py-6 space-y-5">
              {status.type === "success" && (
                <div className="rounded-md border border-green-700/60 bg-[#13281a] text-green-200 px-4 py-2">
                  ✅ {status.msg}
                </div>
              )}
              {status.type === "error" && (
                <div className="rounded-md border border-yellow-800/60 bg-[#2a1b00] text-yellow-100 px-4 py-2">
                  ⚠️ {status.msg}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#A0AEC0] mb-2">
                    Name
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#182238] text-[#E7EDF7] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3A7BFF]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[#A0AEC0] mb-2">
                    Email address
                  </label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#182238] text-[#E7EDF7] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3A7BFF]"
                    placeholder="you@example.com"
                    type="email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#A0AEC0] mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={6}
                  className="w-full rounded-xl border border-white/10 bg-[#182238] text-[#E7EDF7] px-3 py-2 outline-none focus:ring-2 focus:ring-[#3A7BFF]"
                  placeholder="How can we help?"
                />
              </div>

              <input
                tabIndex={-1}
                autoComplete="off"
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                className="hidden"
                aria-hidden="true"
              />

              <div className="flex justify-end">
                <button
                  disabled={status.type === "submitting"}
                  className="inline-flex items-center gap-2 bg-[#2B5DFF] hover:bg-[#1F4EEB] disabled:opacity-60 text-white px-5 py-2 rounded-xl text-sm transition"
                  type="submit"
                >
                  {status.type === "submitting" && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  )}
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
      <div className="w-full bg-[#0D1220] px-4 pb-16">
        <StatsPanel dense className="w-full" />
      </div>
      <Footer />
    </>
  );
}
