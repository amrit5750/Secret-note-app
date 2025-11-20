/* eslint-disable @next/next/no-img-element */
"use client";
import { useState } from "react";

export default function NewAdPage() {
  const [form, setForm] = useState({
    title: "",
    location: "",
    price: 0,
    currency: "INR",
    description: "",
    durationDays: 7,
    pin: "",
  });
  const [payment, setPayment] = useState<{
    paymentUrl: string;
    qr?: string;
    manageUrl: string;
  }>();
  const [pending, setPending] = useState(false);

  async function submit() {
    setPending(true);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok) return alert(data.error || "Failed");
    setPayment({
      paymentUrl: data.paymentUrl,
      qr: data.qr,
      manageUrl: data.manageUrl,
    });
  }

  return (
    <main className="min-h-screen bg-[#0D1220] text-[#E7EDF7] px-4 py-16">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold">Post a Classified</h1>

        {!payment ? (
          <div className="rounded-2xl border border-white/10 bg-[#141B2B] p-6 space-y-4">
            {/* inputs (use your Input component styles) */}
            <input
              className="w-full bg-[#0E1527] border border-white/10 rounded px-3 py-2"
              placeholder="Title (e.g., Maruti Car for Sale in India)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                className="bg-[#0E1527] border border-white/10 rounded px-3 py-2"
                placeholder="Location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  className="flex-1 bg-[#0E1527] border border-white/10 rounded px-3 py-2"
                  placeholder="Price"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: Number(e.target.value) })
                  }
                />
                <select
                  className="bg-[#0E1527] border border-white/10 rounded px-3"
                  value={form.currency}
                  onChange={(e) =>
                    setForm({ ...form, currency: e.target.value })
                  }
                >
                  <option>INR</option>
                  <option>USD</option>
                </select>
              </div>
            </div>
            <textarea
              rows={6}
              className="w-full bg-[#0E1527] border border-white/10 rounded px-3 py-2"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                min={1}
                max={60}
                className="bg-[#0E1527] border border-white/10 rounded px-3 py-2"
                value={form.durationDays}
                onChange={(e) =>
                  setForm({ ...form, durationDays: Number(e.target.value) })
                }
              />
              <input
                inputMode="numeric"
                pattern="\d{4}"
                maxLength={4}
                className="bg-[#0E1527] border border-white/10 rounded px-3 py-2"
                placeholder="4-digit PIN"
                value={form.pin}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pin: e.target.value.replace(/\D/g, "").slice(0, 4),
                  })
                }
              />
            </div>
            <button
              disabled={pending}
              onClick={submit}
              className="px-4 py-2 rounded border border-[#3A7BFF] hover:bg-[#3A7BFF]/15"
            >
              {pending ? "Creating…" : "Continue to Payment"}
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[#141B2B] p-6 space-y-4">
            <p className="text-sm text-[#A0AEC0]">
              Scan or open the invoice to pay. Your ad goes live after
              confirmation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <a
                href={payment.paymentUrl}
                target="_blank"
                className="rounded border border-[#3A7BFF] px-4 py-2 text-center hover:bg-[#3A7BFF]/15"
              >
                Open Payment
              </a>
              {payment.qr && (
                <img
                  src={payment.qr}
                  alt="Invoice QR"
                  className="w-40 h-40 border border-white/10 rounded"
                />
              )}
            </div>
            <div className="text-xs text-[#9BA7BD]">
              Manage link (save it): <br />
              <span className="break-all">{payment.manageUrl}</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
