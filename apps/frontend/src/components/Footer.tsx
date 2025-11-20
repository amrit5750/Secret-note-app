"use client";

import Link from "next/link";
import Image from "next/image";
import { Info } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#0E1422] text-[#E7EDF7]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <Image
              src="/cryptnote.svg"
              alt="Cryptnote"
              width={28}
              height={28}
              className="rounded"
            />
            <span className="font-semibold text-white text-lg">Cryptnote</span>
          </div>
          <p className="mt-3 text-sm text-[#A0AEC0] leading-relaxed">
            Ephemeral, end-to-end encrypted notes. Share once, then it’s gone.
          </p>
        </div>

        <div>
          <ul className="space-y-2 text-sm text-[#A0AEC0]">
            <li>
              <Link href="/" className="hover:text-white transition">
                New Note
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition">
                About
              </Link>
            </li>
            <li>
              <Link href="/help" className="hover:text-white transition">
                Help / FAQ
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <ul className="space-y-2 text-sm text-[#A0AEC0]">
            <li>
              <Link href="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/donate" className="hover:text-white transition">
                Donate
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
            <Info size={14} className="text-[#A0AEC0]" /> How it works
          </h4>
          <p className="text-sm text-[#A0AEC0] leading-relaxed">
            We encrypt the note in transit; it self-destructs after viewing or
            when it expires. No re-access. No lingering data.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 text-xs flex flex-col sm:flex-row items-center justify-between text-[#A0AEC0]">
          <p>© {new Date().getFullYear()} Cryptnote. All rights reserved.</p>
          <p>
            Built with care —{" "}
            <span className="text-[#3A7BFF]">privacy first</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
