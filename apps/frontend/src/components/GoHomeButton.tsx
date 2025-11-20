"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface GoHomeButtonProps {
  label?: string;
  className?: string;
}

const GoHomeButton: React.FC<GoHomeButtonProps> = ({
  label = "Go Home",
  className = "",
}) => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push("/")}
      className={`md:text-base border-2 bg-transparent hover:bg-[#1F4EEB]   hover:text-white text-white px-5 py-2 rounded-md text-sm transition duration-200 ${className}`}
    >
      {label}
    </button>
  );
};

export default GoHomeButton;
