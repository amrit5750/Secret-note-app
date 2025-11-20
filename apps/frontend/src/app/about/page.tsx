import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ShieldCheck, Lock, Timer, Reply } from "lucide-react";
import StatsPanel from "@/components/StatsPanel";

export const metadata = {
  title: "CryptNote",
  description:
    "Learn how CryptNote lets you share sensitive info once, then make it disappear.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0D1220] text-[#E7EDF7]">
        <section className="w-full max-w-4xl mx-auto px-4 pt-16 pb-24">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold">About Cryptnote</h1>
            <p className="text-sm text-[#A0AEC0] mt-2">
              Share something sensitive <em>once</em>—then make it disappear.
            </p>
            <div className="mt-4 h-px bg-white/10" />
          </header>

          {/* Intro */}
          <div className="space-y-4 text-[#CFE3FF] leading-relaxed">
            <p>
              Cryptnote exists for moments when email or chat history is too
              permanent. Notes often linger in archives, get forwarded by
              accident, or surface in old backups. Cryptnote gives you a
              short-lived link you can share safely and forget.
            </p>
            <p>
              When you create a note, we generate a unique URL. Once that URL is
              opened and the note is revealed, it self-destructs and the link
              stops working. You can also set a time-based expiry so the note
              auto-deletes even if nobody opens it.
            </p>
            <p>
              Notes travel over HTTPS. If you add a password, the note is stored
              encrypted on the server while the password itself is never saved.
              When the note expires or is viewed, we delete it—no lingering
              data.
            </p>
          </div>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-10">
            <div className="rounded-2xl border border-white/10 bg-[#141B2B] p-5">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#3A7BFF]" />
                What you can control
              </h2>
              <ul className="list-disc list-inside text-[#CFE3FF] space-y-1">
                <li>One-time read (destroy after viewing)</li>
                <li>Time-based expiry (hours / days)</li>
                <li className="flex items-start gap-2">
                  <Lock size={16} className="mt-0.5 text-[#A0AEC0]" />
                  <span>Optional password protection</span>
                </li>
                <li className="flex items-start gap-2">
                  <Reply size={16} className="mt-0.5 text-[#A0AEC0]" />
                  <span>
                    Reply flow (secure reply as a new self-destructing note)
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#141B2B] p-5">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <Timer size={18} className="text-[#3A7BFF]" />
                Why people use Cryptnote
              </h2>
              <ul className="list-disc list-inside text-[#CFE3FF] space-y-1">
                <li>Share credentials or one-off secrets safely</li>
                <li>Avoid long-lived email / chat history</li>
                <li>No account required</li>
                <li>Lightweight, fast, and focused</li>
              </ul>
            </div>
          </div>

          {/* Closing & CTA */}
          <div className="space-y-6">
            <p className="text-[#CFE3FF] leading-relaxed">
              We built Cryptnote to be safe by default and simple to use. More
              features will be announced here as they land.
            </p>

            <div className="rounded-2xl border border-white/10 bg-[#141B2B] p-5 flex flex-col sm:flex-row items-center gap-3 justify-between">
              <p className="text-sm text-[#A0AEC0]">
                Ready to share something that shouldn’t linger?
              </p>
              <div className="flex items-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl border border-[#3A7BFF] px-4 py-2 text-sm text-white hover:bg-[#3A7BFF]/15 transition"
                >
                  Create a note
                </Link>
                <Link
                  href="/help"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 px-4 py-2 text-sm text-[#E7EDF7] hover:bg-white/5 transition"
                >
                  Help / FAQ
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
      <div className="w-full bg-[#0D1220] px-4 pb-16">
        <StatsPanel dense className="w-full" />
      </div>

      <Footer />
    </>
  );
}
