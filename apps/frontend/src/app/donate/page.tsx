/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastSuccess from "@/components/ToastSuccess";
import StatsPanel from "@/components/StatsPanel";

export default function DonatePage() {
  // ── Config via env ────────────────────────────────────────────────────────────
  const BTC_ADDRESS =
    process.env.NEXT_PUBLIC_BTC_ADDRESS || "bc1q-example-address-change-me";
  // optional — suggest a default amount in BTC (e.g., "0.0005")
  const SUGGESTED_AMOUNT = process.env.NEXT_PUBLIC_BTC_AMOUNT || "";
  // optional copy shown in wallet
  const LABEL = process.env.NEXT_PUBLIC_BTC_LABEL || "Cryptnote Donation";
  const MESSAGE =
    process.env.NEXT_PUBLIC_BTC_MESSAGE || "Thanks for supporting Cryptnote";

  // Build a bitcoin: URI like:
  const bitcoinUri = useMemo(() => {
    const qs = new URLSearchParams();
    if (SUGGESTED_AMOUNT) qs.set("amount", SUGGESTED_AMOUNT);
    if (LABEL) qs.set("label", LABEL);
    if (MESSAGE) qs.set("message", MESSAGE);
    const suffix = qs.toString();
    return `bitcoin:${BTC_ADDRESS}${suffix ? `?${suffix}` : ""}`;
  }, [BTC_ADDRESS, SUGGESTED_AMOUNT, LABEL, MESSAGE]);

  // ── UI state ─────────────────────────────────────────────────────────────────
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const QR = await import("qrcode");
        const url = await QR.toDataURL(bitcoinUri); // QR encodes the bitcoin: URI
        setQrDataUrl(url);
      } catch {
        setQrDataUrl("");
      }
    })();
  }, [bitcoinUri]);

  const copy = () => {
    navigator.clipboard.writeText(BTC_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0D1220] text-[#E7EDF7] px-4 py-20 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          <div className="bg-[#141B2B] border border-white/10 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
            <header className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold">
                Support Cryptnote
              </h1>
              <p className="text-[#A0AEC0]">
                If this project helps you share sensitive info safely, consider
                supporting its development. Thank you! 🙏
              </p>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-[#182238] border border-white/10 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">₿</span>
                  <h2 className="text-xl font-semibold">Bitcoin (BTC)</h2>
                </div>

                <a
                  href={bitcoinUri}
                  className="block group"
                  aria-label="Open your Bitcoin wallet to donate"
                >
                  <div className="text-[#E7EDF7] break-all bg-[#111827]/40 border border-white/10 rounded-lg p-3 transition-colors group-hover:bg-[#111827]/55">
                    {BTC_ADDRESS}
                  </div>
                  <p className="mt-1 text-xs text-[#9BA7BD]">
                    Tap the address to open your Bitcoin wallet
                    {SUGGESTED_AMOUNT
                      ? ` (suggested: ${SUGGESTED_AMOUNT} BTC)`
                      : ""}
                    .
                  </p>
                </a>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={copy}
                    className="border border-[#3A7BFF] text-white px-4 py-2 rounded-xl text-sm hover:bg-[#3A7BFF]/15 transition"
                  >
                    Copy Address
                  </button>

                  <a
                    href={bitcoinUri}
                    className="border border-white/15 text-white/90 px-4 py-2 rounded-xl text-sm hover:bg-white/5 transition"
                    aria-label="Open in wallet"
                  >
                    Open in Wallet
                  </a>
                </div>

                <p className="text-xs text-[#9BA7BD]">
                  Network:{" "}
                  <span className="text-[#E7EDF7]">Bitcoin (on-chain)</span>.
                  Lightning not supported on this page.
                </p>
              </div>

              <a
                href={bitcoinUri}
                className="bg-[#182238] border border-white/10 rounded-xl p-5 flex flex-col items-center justify-center hover:bg-white/5 transition"
                aria-label="Scan or click QR to donate with your wallet"
              >
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt="BTC donation QR (opens wallet)"
                    className="w-40 h-40 rounded-md border border-white/10"
                  />
                ) : (
                  <div className="w-40 h-40 rounded-md border border-white/10 grid place-items-center text-[#A0AEC0] text-sm">
                    QR loading…
                  </div>
                )}
                <p className="mt-3 text-xs text-[#A0AEC0]">
                  Scan or click to donate BTC
                </p>
              </a>
            </section>
          </div>
        </div>

        {copied && (
          <div className="fixed top-15 right-75 z-50">
            <ToastSuccess
              title="Address Copied"
              message="BTC address copied to your clipboard."
              onClose={() => setCopied(false)}
            />
          </div>
        )}
      </div>

      <div className="w-full bg-[#0D1220] px-4 pb-16">
        <StatsPanel dense className="w-full" />
      </div>
      <Footer />
    </>
  );
}
