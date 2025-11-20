"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/help", label: "Help/FAQ" },
  { href: "/donate", label: "Donate" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  const linkClasses = (href: string) =>
    `relative px-3 py-2 rounded-md text-sm font-medium transition-colors
     ${isActive(href) ? "text-white" : "text-gray-300 hover:text-white"}
     after:absolute after:left-3 after:right-3 after:-bottom-0.5
     ${
       isActive(href)
         ? "after:bg-[#3A7BFF] after:h-[2px] after:rounded-full"
         : "after:bg-transparent"
     }`;

  return (
    <nav className="sticky top-0 z-40 border-b border-white/10 bg-[#0E1422]/70 backdrop-blur supports-[backdrop-filter]:bg-[#0E1422]/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/cryptnote.svg"
              alt="Cryptnote"
              width={32}
              height={40}
              priority
            />
            <span className="text-white font-semibold tracking-wide text-2xl">
              CryptNote
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-2">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} className={linkClasses(l.href)}>
                {l.label}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-3">
            <div className="flex flex-col gap-1 border-t border-white/10 pt-3">
              {LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`px-3 py-2 rounded-md text-sm ${
                    isActive(l.href)
                      ? "text-white bg-white/5"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
