"use client";

import { useState, useEffect } from "react";
import AlertBanner from "./AlertBanner";

interface Props {
  durationValue: number;
  setDurationValue: (value: number) => void;
  durationUnit: string;
  setDurationUnit: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  repeatPassword: string;
  setRepeatPassword: (value: string) => void;
}

export default function SelfDestructOptions({
  durationValue,
  setDurationValue,
  durationUnit,
  setDurationUnit,
  password,
  setPassword,
  repeatPassword,
  setRepeatPassword,
}: Props) {
  const [error, setError] = useState("");

  useEffect(() => {
    if (password && password !== repeatPassword) {
      setError("Passwords do not match");
    } else if (password && password.length < 6) {
      setError("Password must be at least 6 characters");
    } else {
      setError("");
    }
  }, [password, repeatPassword]);

  return (
    <div className="space-y-5 rounded-2xl bg-[#141B2B] border border-white/10 p-5">
      {/* Section title */}
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white/90">
          Self-destruction
        </h3>
        <p className="text-xs text-[#A0AEC0]">
          Notes delete after first view, or you can set a time limit.
        </p>
      </div>

      {/* Rule controls */}
      <div>
        <label className="block mb-2 text-sm text-[#A0AEC0]">
          Self-destruction rule
        </label>

        <div className="flex flex-wrap items-center gap-3">
          {/* One-view chip (informational) */}
          <div className="px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[#E7EDF7] text-sm">
            After reading
          </div>

          <span className="text-[#A0AEC0] text-xs font-medium">OR</span>

          {/* Duration value */}
          <input
            type="number"
            min={1}
            value={durationValue}
            onChange={(e) => {
              const n = Number(e.target.value);
              setDurationValue(Number.isFinite(n) && n > 0 ? n : 1);
            }}
            className="w-24 text-center px-3 py-2 rounded-xl bg-[#182238] text-[#E7EDF7]
                       placeholder-[#9BA7BD] border border-white/10 outline-none
                       focus:ring-2 focus:ring-[#3A7BFF] focus:border-transparent"
          />

          {/* Duration unit */}
          <select
            value={durationUnit}
            onChange={(e) => setDurationUnit(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#182238] text-[#E7EDF7]
                       border border-white/10 outline-none
                       focus:ring-2 focus:ring-[#3A7BFF] focus:border-transparent"
          >
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </div>
      </div>

      {/* Passwords */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-2 text-sm text-[#A0AEC0]">
            Enter password <span className="text-[#A0AEC0]/60">(optional)</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#182238] text-[#E7EDF7]
                       placeholder-[#9BA7BD] border border-white/10 outline-none
                       focus:ring-2 focus:ring-[#3A7BFF] focus:border-transparent"
          />
        </div>

        <div>
          <label className="block mb-2 text-sm text-[#A0AEC0]">
            Confirm password
          </label>
          <input
            type="password"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#182238] text-[#E7EDF7]
                       placeholder-[#9BA7BD] border border-white/10 outline-none
                       focus:ring-2 focus:ring-[#3A7BFF] focus:border-transparent"
          />
        </div>
      </div>

      {error && (
        <div
          role="alert"
          onClick={() => setError("")}
          className="
      relative cursor-pointer rounded-xl
      border border-red-500/25 bg-[#1A0F14] text-[#F8E7E7]
      px-4 py-3 text-sm shadow-sm ring-1 ring-white/5
      before:absolute before:inset-y-0 before:left-0 before:w-1
      before:bg-gradient-to-b before:from-red-500 before:to-red-400/70
      before:content-['']
    "
        >
          <div className="flex items-start gap-2">
            <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-500/15 text-red-300 text-xs font-bold">
              !
            </span>
            <p className="leading-relaxed">{error}</p>
          </div>
        </div>
      )}
    </div>
  );
}
