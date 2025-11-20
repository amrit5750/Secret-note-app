"use client";

import React from "react";

type Variant = "error" | "warning" | "success" | "info";

interface AlertBannerProps {
  message: React.ReactNode;
  onClose?: () => void; // called on click (dismiss)
  className?: string; // extra classes
  variant?: Variant; // defaults to "error"
  clickable?: boolean; // defaults to true
}

const VARIANT_STYLES: Record<
  Variant,
  { wrap: string; accent: string; pill: string }
> = {
  error: {
    wrap: "border-red-500/25 bg-[#1A0F14] text-[#F8E7E7]",
    accent: "before:from-red-500 before:to-red-400/70",
    pill: "bg-red-500/15 text-red-300",
  },
  warning: {
    wrap: "border-amber-500/25 bg-[#1A1400] text-[#FFF4E5]",
    accent: "before:from-amber-500 before:to-amber-400/70",
    pill: "bg-amber-500/15 text-amber-300",
  },
  success: {
    wrap: "border-emerald-500/25 bg-[#0F1A14] text-[#E7F8F0]",
    accent: "before:from-emerald-500 before:to-emerald-400/70",
    pill: "bg-emerald-500/15 text-emerald-300",
  },
  info: {
    wrap: "border-sky-500/25 bg-[#0F151A] text-[#E7F2F8]",
    accent: "before:from-sky-500 before:to-sky-400/70",
    pill: "bg-sky-500/15 text-sky-300",
  },
};

const VARIANT_ICON: Record<Variant, string> = {
  error: "!",
  warning: "!",
  success: "✓",
  info: "i",
};

export default function AlertBanner({
  message,
  onClose,
  className = "",
  variant = "error",
  clickable = true,
}: AlertBannerProps) {
  const v = VARIANT_STYLES[variant];

  return (
    <div
      role="alert"
      onClick={clickable ? onClose : undefined}
      className={[
        // base container
        "relative rounded-xl px-4 py-3 text-sm shadow-sm ring-1 ring-white/5",
        "border cursor-pointer",
        // left gradient bar
        "before:absolute before:inset-y-0 before:left-0 before:w-1",
        "before:bg-gradient-to-b before:content-['']",
        // variant styles
        v.wrap,
        v.accent,
        className,
      ].join(" ")}
    >
      <div className="flex items-start gap-2">
        <span
          className={[
            "mt-0.5 inline-flex h-5 w-5 items-center justify-center",
            "rounded-full text-xs font-bold",
            v.pill,
          ].join(" ")}
        >
          {VARIANT_ICON[variant]}
        </span>
        <p className="leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
