/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

type StatResponse = {
  totals: {
    totalNotes: number;
    activeNotes: number;
    destroyed: number; // viewed + expired
    viewed: number; // 👈 new
    expired: number; // 👈 new
    replies: number;
  };
  generatedAt: string;
};

type Props = { className?: string; apiBase?: string; dense?: boolean };

function Card({
  title,
  value,
  dense,
}: {
  title: string;
  value: string | number;
  dense?: boolean;
}) {
  return (
    <div
      className={[
        "rounded-xl border border-white/10 bg-[#141B2B] shadow",
        dense ? "px-4 py-4" : "px-6 py-5",
        "flex flex-col justify-between",
      ].join(" ")}
    >
      <div className="space-y-1">
        <div className="text-[11px] uppercase tracking-wide text-[#A0AEC0]">
          {title}
        </div>
        <div
          className={
            dense
              ? "text-2xl font-semibold text-[#E7EDF7]"
              : "text-3xl font-semibold text-[#E7EDF7]"
          }
        >
          {value}
        </div>
      </div>
    </div>
  );
}

export default function StatsPanel({
  className = "",
  apiBase,
  dense = true,
}: Props) {
  const [data, setData] = useState<StatResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const base = apiBase || process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${base}/api/stats`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load");
        const json: StatResponse = await res.json();
        if (mounted) setData(json);
      } catch (e: any) {
        if (mounted) setError(e?.message || "Failed to load");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [base]);

  return (
    <section className={`w-full ${className}`}>
      <div className="rounded-2xl border border-white/10 bg-[#141B2B] shadow-xl">
        <div
          className={`border-b border-white/10 rounded-t-2xl bg-[#111827]/40 ${
            dense ? "px-5 py-3" : "px-6 py-4"
          }`}
        >
          <h2
            className={
              dense
                ? "text-base font-semibold text-[#E7EDF7]"
                : "text-lg sm:text-xl font-semibold text-[#E7EDF7]"
            }
          >
            Usage Statistics
          </h2>
          <p className="text-[11px] text-[#A0AEC0] mt-0.5">
            Live snapshot of notes activity.
          </p>
        </div>

        <div className={dense ? "p-4" : "p-6"}>
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-white/10 bg-[#141B2B] px-4 py-4 shadow animate-pulse"
                >
                  <div className="h-2.5 w-24 bg-white/10 rounded" />
                  <div className="mt-2 h-6 w-16 bg-white/10 rounded" />
                </div>
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-md border border-yellow-800/60 bg-[#2a1b00] text-yellow-100 px-4 py-2">
              ⚠️ {error}
            </div>
          )}

          {!loading && data && (
            // One row: 6 columns on large screens
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              <Card
                dense={dense}
                title="Notes created"
                value={data.totals.totalNotes}
              />
              <Card
                dense={dense}
                title="Active notes"
                value={data.totals.activeNotes}
              />
              <Card
                dense={dense}
                title="Viewed (destroyed)"
                value={data.totals.viewed}
              />
              <Card dense={dense} title="Expired" value={data.totals.expired} />
              <Card dense={dense} title="Replies" value={data.totals.replies} />
              <div
                className={[
                  "rounded-xl border border-white/10 bg-[#141B2B] shadow",
                  dense ? "px-4 py-4" : "px-6 py-5",
                  "flex flex-col justify-between",
                ].join(" ")}
              >
                <div className="text-[11px] uppercase tracking-wide text-[#A0AEC0]">
                  Snapshot time
                </div>
                <div
                  className={
                    dense
                      ? "text-base text-[#E7EDF7] mt-1"
                      : "text-lg text-[#E7EDF7] mt-1"
                  }
                >
                  {new Date(data.generatedAt).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
