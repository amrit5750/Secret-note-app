/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef, JSX } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import ToastSuccess from "@/components/ToastSuccess";
import SelfDestructOptions from "@/components/SelfDestructOptions";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AlertBanner from "@/components/AlertBanner";
import StatsPanel from "@/components/StatsPanel";

// Quick ObjectId format check (24 hex chars)
const isValidObjectId = (v: unknown): v is string =>
  typeof v === "string" && /^[a-f\d]{24}$/i.test(v);

// Pretty date/time
const fmt = (d?: string | null) =>
  d
    ? new Intl.DateTimeFormat("en-US", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(new Date(d))
    : "";

type Prot = "password" | "server" | "none";

const labelFrom = (p: Prot | null | undefined) =>
  p === "password"
    ? "Password-protected note"
    : p === "server"
    ? "Encrypted note"
    : "Note";

export default function ViewNote() {
  const params = useParams();
  const router = useRouter();
  const id = typeof params?.id === "string" ? params.id : "";

  const [confirmed, setConfirmed] = useState(false);
  const [requiresPassword, setRequiresPassword] = useState(false);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [replyPassword, setReplyPassword] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState<
    "" | "invalid_id" | "expired" | "not_found" | "invalid_password" | "unknown"
  >("");
  const [viewed, setViewed] = useState(false);

  // NEW: richer protection + timestamps for messages
  const [protection, setProtection] = useState<Prot | null>(null);
  const [wasProtection, setWasProtection] = useState<Prot | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [viewedAt, setViewedAt] = useState<string | null>(null);
  const [wasViewed, setWasViewed] = useState<boolean | null>(null);

  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyVisible, setReplyVisible] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [creatingReply, setCreatingReply] = useState(false);
  const [replySuccess, setReplySuccess] = useState(false);
  const [replyError, setReplyError] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [durationValue, setDurationValue] = useState(24);
  const [durationUnit, setDurationUnit] = useState("hours");
  const [expiredAt, setExpiredAt] = useState<string | null>(null);

  const passwordInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!loading && !confirmed && requiresPassword) {
      setTimeout(() => passwordInputRef.current?.focus(), 0);
    }
  }, [loading, confirmed, requiresPassword]);

  useEffect(() => {
    if (error === "invalid_password") {
      passwordInputRef.current?.focus();
      passwordInputRef.current?.select();
    }
  }, [error]);

  useEffect(() => {
    if (replyVisible) textareaRef.current?.focus();
  }, [replyVisible]);

  // Fetch note metadata on mount
  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      if (!isValidObjectId(id)) {
        setError("invalid_id");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notes/${id}/meta`,
          { signal: controller.signal as any }
        );

        // Live note meta
        setRequiresPassword(!!res.data.requiresPassword);
        setProtection(
          (res.data.protection as Prot) ??
            (res.data.requiresPassword ? "password" : "none")
        );
        setCreatedAt(res.data.createdAt);
        setExpiresAt(res.data.expiresAt ?? null);
        setError("");
      } catch (err: any) {
        const status = err?.response?.status;
        if (status === 410) {
          const d = err.response?.data || {};
          setWasViewed(typeof d.viewed === "boolean" ? d.viewed : null);
          setWasProtection(
            (d.wasProtection as Prot) ??
              (typeof d.requiresPassword === "boolean"
                ? d.requiresPassword
                  ? "password"
                  : "none"
                : null)
          );
          setExpiredAt(d.expiredAt || null);
          setViewedAt(d.viewedAt || null);
          setCreatedAt(d.createdAt || null);
          setError("expired");
        } else if (status === 404) {
          setError("not_found");
        } else {
          setError("unknown");
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [id]);

  const openedStatus = () => {
    const label = labelFrom(
      protection ?? (requiresPassword ? "password" : "none")
    );
    const created = fmt(createdAt);
    const opened = fmt(viewedAt);
    if (created && opened)
      return `${label} was created on ${created} and opened on ${opened}.`;
    if (created) return `${label} was created on ${created}.`;
    return "";
  };

  // Reveal note
  const fetchNote = async (): Promise<boolean> => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notes/${id}`,
        { password }
      );
      setNote(res.data.content);
      setViewedAt(new Date().toISOString());
      setError("");
      return true;
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 410) {
        const d = err.response?.data || {};
        setWasViewed(typeof d.viewed === "boolean" ? d.viewed : null);
        setWasProtection(
          (d.wasProtection as Prot) ??
            (typeof d.requiresPassword === "boolean"
              ? d.requiresPassword
                ? "password"
                : "none"
              : null)
        );
        setExpiredAt(d.expiredAt || null);
        setViewedAt(d.viewedAt || null);
        setError("expired");
      } else if (status === 404) {
        setError("not_found");
      } else if (status === 401) {
        setError("invalid_password");
      } else {
        setError("unknown");
      }
      return false;
    }
  };

  // Unified action for the button + Enter key
  const handleReveal = async () => {
    if (requiresPassword && password.length < 6) {
      setError("invalid_password");
      setTimeout(() => setError(""), 2500);
      return;
    }
    const ok = await fetchNote();
    if (ok) {
      setConfirmed(true);
      setViewed(true);
    }
  };

  // Status lines
  const liveStatus = () => {
    const label = labelFrom(
      protection ?? (requiresPassword ? "password" : "none")
    );
    const created = fmt(createdAt);
    const exp = fmt(expiresAt);
    if (created && exp)
      return `${label} was created on ${created} and will expire on ${exp}.`;
    if (created) return `${label} was created on ${created}.`;
    return "";
  };

  const expiredStatus = () => {
    const label = labelFrom(
      wasProtection ?? protection ?? (requiresPassword ? "password" : "none")
    );
    const created = fmt(createdAt);
    if (wasViewed === true && viewedAt) {
      return `${label} was created on ${created} and was read on ${fmt(
        viewedAt
      )}.`;
    }
    const when = fmt(expiredAt);
    return `${label} was created on ${created} and expired on ${when} without being read.`;
  };

  // Accent + shared styles
  const accent = "text-white border border-[#3A7BFF] hover:bg-[#3A7BFF]/15";
  const ghost = "text-[#E7EDF7] border border-white/10 hover:bg-white/5";

  // Empty/expired state card
  const MissingNote = () => (
    <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#141B2B] p-8 shadow-lg space-y-4">
      {error === "invalid_id" ? (
        <AlertBanner variant="error" message="Invalid link or wrong URL." />
      ) : error === "expired" ? (
        <AlertBanner variant="error" message={expiredStatus()} />
      ) : error === "not_found" ? (
        <AlertBanner
          variant="error"
          message="Note not found. The link may be wrong or the note was deleted."
        />
      ) : (
        <AlertBanner
          variant="error"
          message="Something went wrong. Please retry."
        />
      )}

      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/")}
          className={`px-4 py-2 rounded-md text-sm transition ${accent}`}
        >
          Create a new note
        </button>
      </div>
    </div>
  );

  // ---------- Choose content ----------
  let content: JSX.Element;

  if (loading) {
    content = <div className="text-[#CFE3FF]/80 text-lg">Loading…</div>;
  } else if (
    !confirmed &&
    (error === "invalid_id" ||
      error === "expired" ||
      error === "not_found" ||
      error === "unknown")
  ) {
    content = <MissingNote />;
  } else if (!confirmed && !viewed) {
    // Confirmation + password if required
    content = (
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#141B2B] p-6 md:p-7 shadow-lg space-y-3">
        <h2 className="text-2xl md:text-3xl font-bold text-[#E7EDF7]">
          📝 Read and destroy?
        </h2>

        {liveStatus() && (
          <p className="text-sm text-[#A0AEC0]">{liveStatus()}</p>
        )}

        <p className="text-[#CFE3FF]/90">
          Are you going to read and destroy the note with the ID <b>{id}</b>?
        </p>

        {requiresPassword && (
          <div className="relative mt-2">
            <input
              ref={passwordInputRef}
              autoFocus
              type={showPassword ? "text" : "password"}
              className="w-full rounded-md bg-[#0E1527] border border-white/10 text-[#E7EDF7] px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#3A7BFF]"
              placeholder="Enter password to view note"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleReveal();
                }
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-[#A0AEC0] hover:text-[#E7EDF7]"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <button
            onClick={handleReveal}
            className={`px-4 py-2 rounded-md text-sm transition ${accent}`}
          >
            Yes, show me the note
          </button>

          <button
            onClick={() => router.push("/")}
            className={`px-4 py-2 rounded-md text-sm transition ${ghost}`}
          >
            No, not now
          </button>
        </div>

        {error === "invalid_password" && (
          <AlertBanner
            variant="error"
            message="Invalid password. Please try again."
          />
        )}
        {error === "unknown" && (
          <AlertBanner
            variant="error"
            message="Something went wrong. Please retry."
          />
        )}
      </div>
    );
  } else if (!note) {
    content = <MissingNote />;
  } else {
    // Normal flow (note revealed)
    content = (
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#141B2B] p-8 shadow-lg space-y-4">
        <div className="space-y-2">
          <div className="rounded-md border border-yellow-800/60 bg-[#2a1b00] text-yellow-100 px-3 py-2 text-xs sm:text-sm">
            ⚠️ One-time note — self-destructs after viewing. Copy or reply now;
            you can’t open it again.
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="text-xs sm:text-[13px] text-[#CFE3FF] bg-white/5 border border-white/10 rounded-md px-2 py-1">
              {openedStatus()}
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(note);
                setShowToast(true);
                setTimeout(() => setShowToast(false), 2000);
              }}
              className={`shrink-0 px-4 py-2 rounded-md text-sm transition ${accent}`}
            >
              Copy Text
            </button>
          </div>
        </div>

        <textarea
          rows={10}
          value={note}
          readOnly
          className="w-full rounded-lg bg-[#0E1527] border border-white/10 text-[#E7EDF7] p-6 focus:outline-none focus:ring-2 focus:ring-[#3A7BFF]"
        />

        {!replyVisible && (
          <div className="flex justify-end">
            <button
              onClick={() => setReplyVisible(true)}
              className={`px-4 py-2 rounded-md text-sm transition ${ghost}`}
            >
              Reply to Note
            </button>
          </div>
        )}

        {replyVisible && (
          <>
            <textarea
              ref={textareaRef}
              autoFocus
              rows={10}
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply here…"
              className="w-full rounded-md bg-[#0E1527] border border-white/10 text-[#E7EDF7] p-4 focus:outline-none focus:ring-2 focus:ring-[#3A7BFF]"
            />

            <SelfDestructOptions
              durationValue={durationValue}
              setDurationValue={setDurationValue}
              durationUnit={durationUnit}
              setDurationUnit={setDurationUnit}
              password={replyPassword}
              setPassword={setReplyPassword}
              repeatPassword={repeatPassword}
              setRepeatPassword={setRepeatPassword}
            />

            <button
              disabled={creatingReply}
              onClick={async () => {
                if (!replyContent.trim()) {
                  setReplyError("Reply cannot be empty");
                  setTimeout(() => setReplyError(""), 2500);
                  return;
                }
                setCreatingReply(true);
                setReplyError("");

                try {
                  const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/notes`,
                    {
                      text: replyContent,
                      password: replyPassword,
                      destroyAfterRead: true,
                      destroyAfterDuration: {
                        value: durationValue,
                        unit: durationUnit,
                      },
                      replyTo: id,
                    }
                  );
                  setReplySuccess(true);
                  setReplyContent("");
                  router.push(`/note-created/${res.data.id}`); // pretty route
                  setError("");
                } catch {
                  setReplyError("Failed to create note");
                  setTimeout(() => setReplyError(""), 3000);
                } finally {
                  setCreatingReply(false);
                }
              }}
              className={`px-4 py-2 rounded-md text-sm transition ${accent} disabled:opacity-60`}
            >
              Create Note
            </button>

            {replySuccess && (
              <p className="text-green-400 text-sm">
                ✅ Reply note created successfully.
              </p>
            )}
            {replyError && <p className="text-red-400 text-sm">{replyError}</p>}
          </>
        )}

        {showToast && (
          <div className="fixed top-15 right-75 z-50">
            <ToastSuccess
              title="Text Copied"
              message="The text was copied to your clipboard."
              onClose={() => setShowToast(false)}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-[#0D1220] text-[#E7EDF7]">
        <Navbar />
        <main className="px-4 pt-16 flex flex-col items-center">{content}</main>
      </div>

      <div className="w-full bg-[#0D1220] px-4 pb-16">
        <StatsPanel dense className="w-full" />
      </div>
      <Footer />
    </>
  );
}
