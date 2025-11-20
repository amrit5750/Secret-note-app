"use client";

import { X } from "lucide-react";

interface ToastSuccessProps {
  title?: string;
  message?: string;
  onClose: () => void;
}

export default function ToastSuccess({
  title = "Link Copied",
  message = "The link was copied to your clipboard.",
  onClose,
}: ToastSuccessProps) {
  return (
    <div className="absolute top-full left-0 mt-2 w-72 z-20 rounded-lg border border-green-500 bg-[#1a2e1a] p-4 shadow-lg flex items-start gap-3">
      <div className="flex-shrink-0">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
          ✓
        </div>
      </div>
      <div className="flex-1">
        <p className="text-green-400 font-semibold text-sm">{title}</p>
        <p className="text-gray-300 text-xs">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white text-lg leading-none"
        aria-label="Close toast"
      >
        <X size={16} />
      </button>
    </div>
  );
}
