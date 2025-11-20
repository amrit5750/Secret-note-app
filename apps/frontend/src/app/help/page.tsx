import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StatsPanel from "@/components/StatsPanel";
import { ChevronDown, Lock, ShieldCheck, Clock, Eye } from "lucide-react";
import type { ReactNode } from "react";

export const metadata = {
  title: "FAQ • Cryptnote",
  description:
    "Common questions about Cryptnote: security, privacy, storage, one-time access, and read notifications.",
};

function Accordion({
  items,
}: {
  items: { icon?: ReactNode; q: string; a: ReactNode }[];
}) {
  return (
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li
          key={idx}
          className="rounded-2xl border border-white/10 bg-[#141B2B] overflow-hidden"
        >
          <details className="group [&_summary::-webkit-details-marker]:hidden">
            <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3A7BFF]">
              <span className="shrink-0 text-[#3A7BFF]">
                {item.icon ?? <ShieldCheck size={18} />}
              </span>
              <h3 className="text-base md:text-[17px] font-medium text-[#E7EDF7]">
                {item.q}
              </h3>
              <ChevronDown
                size={18}
                className="ml-auto text-[#A0AEC0] transition-transform duration-200 group-open:rotate-180"
                aria-hidden
              />
            </summary>

            <div className="px-4 pb-4 pt-1 text-sm md:text-[15px] leading-relaxed text-[#CFE3FF]/90 border-t border-white/10">
              {item.a}
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}

export default function FAQPage() {
  const items = [
    {
      icon: <ShieldCheck size={18} />,
      q: "How safe is Cryptnote?",
      a: (
        <>
          No online service is 100% immune, but Cryptnote is designed to
          minimize exposure. Notes are encrypted in transit, can be protected
          with a password you control, and by default are destroyed after
          they’re revealed one time. Without both the unique link and (when
          used) the password, decrypting the content is extremely difficult.
        </>
      ),
    },
    {
      icon: <Lock size={18} />,
      q: "How is data kept private?",
      a: (
        <>
          Every share link is a high-entropy, random URL that only you choose to
          share. Password-protected notes require the viewer to supply the
          password; it isn’t stored on the server. After first view or when the
          expiry you set is reached, the note is removed. We don’t run ads, sell
          data, or keep tracking profiles.
        </>
      ),
    },
    {
      icon: <Clock size={18} />,
      q: "How are notes stored before they’re read?",
      a: (
        <>
          Notes are stored encrypted on the server with no public relation
          between the URL and the record. Each note (even with identical text)
          gets a fresh, random link. Once the note is viewed or expires, it is
          deleted—no content backups are kept.
        </>
      ),
    },
    {
      icon: <Eye size={18} />,
      q: "Can I retrieve a note after it has been read?",
      a: (
        <>
          No. Cryptnote is intentionally ephemeral. After the allowed view is
          consumed (default is one view), the note is removed and the link no
          longer works.
        </>
      ),
    },
    {
      icon: <Lock size={18} />,
      q: "Who else has access to my note?",
      a: (
        <>
          Only the person with the link (and the password if you set one). We do
          not share notes publicly, and we do not store your password. Opening
          the link validates it and then reveals the content if it hasn’t
          expired.
        </>
      ),
    },
    {
      icon: <Eye size={18} />,
      q: "How do I know a note has been read?",
      a: (
        <>
          When you create a note, you can optionally enable read notification or
          keep a personal reference. After the first view, the link stops
          working—which is itself a simple indicator that the note was opened.
        </>
      ),
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-[#0D1220] text-[#E7EDF7]">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <h1 className="text-center text-2xl md:text-3xl font-bold mb-6">
            Common questions
          </h1>

          <Accordion items={items} />

          <p className="text-center text-xs text-[#A0AEC0] mt-8">
            Still stuck?{" "}
            <a className="text-[#3A7BFF] hover:underline" href="/contact">
              Contact us
            </a>
            .
          </p>
        </main>
      </div>
      <div className="w-full bg-[#0D1220] px-4 pb-16">
        <StatsPanel dense className="w-full" />
      </div>
      <Footer />
    </>
  );
}
