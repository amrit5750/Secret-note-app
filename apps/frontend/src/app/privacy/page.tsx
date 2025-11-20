import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StatsPanel from "@/components/StatsPanel";

export const metadata = {
  title: "Privacy Policy • Cryptnote",
  description: "How Cryptnote handles your data.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#0D1220] text-[#E7EDF7] flex flex-col">
        <main className="flex-1">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
            <header className="mb-8">
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="text-sm text-[#A0AEC0] mt-2">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "2-digit",
                })}
              </p>
              <div className="mt-4 h-px bg-white/10" />
            </header>

            <section className="space-y-6 text-[#CFE3FF] leading-relaxed">
              <p>
                Your privacy is the core of Cryptnote. The goal of this document
                is to explain—in plain language—what information we handle, for
                how long, and what we never touch. If anything here isn’t clear,
                reach out at{" "}
                <a
                  className="text-[#bb3e03] hover:underline"
                  href="mailto:support@cryptnote.sh"
                >
                  support@cryptnote.sh
                </a>
                .
              </p>

              <h2 className="text-xl font-semibold mt-8">What we collect</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <span className="font-medium">Note content (temporary).</span>{" "}
                  Notes exist only to serve the share link. They are removed
                  after first view or when the timer you chose expires—whichever
                  happens first.
                </li>
                <li>
                  <span className="font-medium">Optional password check.</span>{" "}
                  If you protect a note with a password, we do not store the
                  password. We only attempt to validate/decrypt with the value
                  you provide when viewing.
                </li>
                <li>
                  <span className="font-medium">Basic service logs.</span> To
                  keep the service healthy and secure, we keep short-lived,
                  minimal logs (e.g., error codes, timestamps). These are
                  automatically rotated and purged on a regular schedule
                  (typically ~7 days).
                </li>
              </ul>

              <h2 className="text-xl font-semibold mt-8">
                What we never collect
              </h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>No accounts, no profiles, no contact lists.</li>
                <li>
                  No analytics that track individuals or build advertising
                  profiles.
                </li>
                <li>No selling or sharing of your data with third parties.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8">
                Cookies & local storage
              </h2>
              <p>
                Cryptnote avoids cookies unless strictly necessary for security
                and basic functionality. We do not use third-party tracking
                pixels or cross-site advertising technologies.
              </p>

              <h2 className="text-xl font-semibold mt-8">Data retention</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Notes: deleted after first view or on expiry—there are no
                  content backups.
                </li>
                <li>Service logs: short-lived and rotated automatically.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8">Security</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Transport security with HTTPS (TLS) when accessed via your
                  domain.
                </li>
                <li>
                  Password-protected notes require the viewer to supply the
                  password; the password itself is not stored on the server.
                </li>
                <li>Access to infrastructure is restricted and monitored.</li>
              </ul>

              <h2 className="text-xl font-semibold mt-8">Your choices</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  Use a password for sensitive notes. Anyone without the
                  password cannot reveal the content via the link.
                </li>
                <li>Choose a short expiry to minimize exposure.</li>
                <li>
                  If you still have a note ID and believe it has not yet
                  expired, contact us to request early deletion.
                </li>
              </ul>

              <h2 className="text-xl font-semibold mt-8">Children’s privacy</h2>
              <p>
                Cryptnote is not intended for children under 13. If you believe
                a child has used the service to submit personal information,
                please contact us and we’ll remove it.
              </p>

              <h2 className="text-xl font-semibold mt-8">
                Changes to this policy
              </h2>
              <p>
                If we make material changes, we’ll update the date at the top of
                this page and, when appropriate, provide additional notice in
                the app.
              </p>

              <h2 className="text-xl font-semibold mt-8">Contact</h2>
              <p>
                Questions about privacy? Email{" "}
                <a
                  className="text-[#bb3e03] hover:underline"
                  href="mailto:support@cryptnote.sh"
                >
                  support@cryptnote.sh
                </a>
                .
              </p>
            </section>
          </div>
        </main>
      </div>
      <div className="w-full bg-[#0D1220] px-4 pb-16">
        <StatsPanel dense className="w-full" />
      </div>
      <Footer />
    </>
  );
}
