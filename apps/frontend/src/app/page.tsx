"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import SelfDestructOptions from "@/components/SelfDestructOptions";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AlertBanner from "@/components/AlertBanner";
import StatsPanel from "@/components/StatsPanel";
import { useRouter } from "next/navigation";

export default function Home() {
  const [text, setText] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState("");
  const [destroyAfterRead] = useState(true);
  const [durationValue, setDurationValue] = useState(24);
  const [durationUnit, setDurationUnit] = useState("hours");

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => textareaRef.current?.focus(), []);

  const router = useRouter();

  const handleCreateNote = async () => {
    if (!text.trim()) {
      setError("Note cannot be empty");
      setTimeout(() => setError(""), 3000);
      return;
    }
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notes`,
        {
          text,
          password,
          destroyAfterRead,
          destroyAfterDuration: { value: durationValue, unit: durationUnit },
        }
      );
      router.push(`/note-created/${res.data.id}`); // 👈 pretty route
      setError("");
    } catch {
      setError("Failed to create note");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <>
      <Navbar />

      {/* Base background = deep navy */}
      <div className="min-h-screen bg-[#0E1422] text-[#E7EDF7] px-4 py-20 flex flex-col items-center">
        {/* Card surface */}
        <div className="w-full max-w-2xl bg-[#141B2B] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-8 space-y-6 text-[15px] md:text-[16px]">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-semibold">📝 New Note</h1>
            <p className="text-[#A0AEC0] text-sm">
              Encrypted in transit. One view by default. No lingering data.
            </p>
          </div>

          <div>
            <label className="block mb-2 text-sm text-[#A0AEC0]">
              <span className="text-[#3A7BFF] font-medium">*</span> Your secure
              message
            </label>

            <textarea
              ref={textareaRef}
              rows={10}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your note here…"
              className="w-full resize-y rounded-xl bg-[#182238] text-[#E7EDF7] placeholder-[#9BA7BD]
                         border border-white/10 p-4 outline-none
                         focus:ring-2 focus:ring-[#3A7BFF] focus:border-transparent"
            />
          </div>

          {showOptions && (
            <SelfDestructOptions
              durationValue={durationValue}
              setDurationValue={setDurationValue}
              durationUnit={durationUnit}
              setDurationUnit={setDurationUnit}
              password={password}
              setPassword={setPassword}
              repeatPassword={repeatPassword}
              setRepeatPassword={setRepeatPassword}
            />
          )}

          {/* Buttons */}
          <div className="flex justify-between gap-3">
            <button
              onClick={handleCreateNote}
              className="px-5 py-2.5 rounded-full bg-[#3A7BFF] hover:bg-[#2F6DFA] active:bg-[#245BE5]
                         text-white font-medium transition"
            >
              Create Note
            </button>

            <button
              onClick={() => setShowOptions((v) => !v)}
              className="px-5 py-2.5 rounded-full border border-white/10 text-[#E7EDF7]
                         hover:bg-white/5 transition"
            >
              {showOptions ? "Hide Options" : "Show Options"}
            </button>
          </div>

          {error && (
            <AlertBanner
              message={error}
              onClose={() => setError("")}
              variant="error"
            />
          )}
        </div>
      </div>
      <div className="w-full bg-[#0D1220] px-4 pb-16">
        <StatsPanel dense className="w-full" />
      </div>
      <Footer />
    </>
  );
}
