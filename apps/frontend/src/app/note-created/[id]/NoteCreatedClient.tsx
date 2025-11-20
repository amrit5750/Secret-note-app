"use client";

import { useMemo, useState } from "react";
import ToastSuccess from "@/components/ToastSuccess";

export default function NoteCreatedClient({ id }: { id: string }) {
  const link = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/view/${id}`;
  }, [id]);

  const [showToast, setShowToast] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = link;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1800);
  };

  return (
    <div className="w-full max-w-3xl bg-[#141B2B] border border-white/10 rounded-2xl shadow-xl p-6 md:p-8 space-y-6">
      <div className="rounded-lg border border-green-700/60 bg-[#13281a] text-green-100 p-4">
        <p className="font-semibold">Message created successfully!</p>
        <ul className="mt-2 list-disc list-inside space-y-1 text-sm leading-relaxed text-[#CFE3FF]">
          <li>Copy the URL below and send it to the recipient.</li>
          <li>
            The note self-destructs after it’s read or when the timer expires.
          </li>
          <li>
            Keep this page private—anyone with the link can read the note once.
          </li>
        </ul>
      </div>

      <div>
        <label className="block text-sm text-[#A0AEC0] mb-2">URL</label>
        <div className="flex items-stretch gap-2">
          <input
            readOnly
            value={link}
            className="flex-1 rounded-xl bg-[#182238] border border-white/10 text-[#E7EDF7] px-3 py-2 text-sm md:text-base outline-none focus:ring-2 focus:ring-[#3A7BFF] select-all"
            aria-label="Note link"
          />
          <button
            onClick={handleCopy}
            className="shrink-0 border border-[#3A7BFF] text-white px-4 py-2 rounded-xl text-sm hover:bg-[#3A7BFF]/15 transition"
          >
            Copy
          </button>
        </div>
      </div>

      {showToast && (
        <div className="fixed top-15 right-75 z-50">
          <ToastSuccess
            title="Link Copied"
            message="The URL was copied to your clipboard."
            onClose={() => setShowToast(false)}
          />
        </div>
      )}
    </div>
  );
}
