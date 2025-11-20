"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type Props = {
  idleMs?: number; // default 5 minutes
  hardReload?: boolean; // force full reload instead of router.refresh()
  enabled?: boolean;
  log?: boolean; // set true to debug in console
};

export default function IdleRefresher({
  idleMs = 1 * 60 * 1000,
  hardReload = true, // 👈 default to full reload for reliability
  enabled = true,
  log = false,
}: Props) {
  const router = useRouter();
  const lastActivityRef = useRef<number>(Date.now());
  const intervalRef = useRef<number | null>(null);
  const shouldRefreshWhenVisibleRef = useRef(false);
  const bcRef = useRef<BroadcastChannel | null>(null);

  const KEY = "cryptnote:lastActivity";

  useEffect(() => {
    if (!enabled) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const debug = (...args: any[]) =>
      log && console.log("[IdleRefresher]", ...args);

    const setLastActivity = (ts = Date.now()) => {
      lastActivityRef.current = ts;
      try {
        localStorage.setItem(KEY, String(ts));
      } catch {}
      if (bcRef.current) {
        try {
          bcRef.current.postMessage({ type: "activity", ts });
        } catch {}
      }
      debug("activity @", new Date(ts).toLocaleTimeString());
    };

    const refresh = () => {
      debug("REFRESH");
      if (hardReload) {
        window.location.reload();
      } else {
        router.refresh();
      }
    };

    const onUserActivity = () => setLastActivity();

    // Check periodically (covers timer throttling in background tabs)
    const checkIdle = () => {
      const now = Date.now();
      const idleFor = now - lastActivityRef.current;
      if (idleFor >= idleMs) {
        if (document.hidden) {
          // Defer until the tab is visible
          shouldRefreshWhenVisibleRef.current = true;
          debug("idle reached while hidden — deferring");
        } else {
          refresh();
        }
      }
    };

    // When user returns to tab or page is restored from bfcache
    const onVisibilityChange = () => {
      if (!document.hidden) {
        const now = Date.now();
        const idleFor = now - lastActivityRef.current;
        debug("visible, idleFor", idleFor);
        if (shouldRefreshWhenVisibleRef.current || idleFor >= idleMs) {
          shouldRefreshWhenVisibleRef.current = false;
          refresh();
        }
      }
    };

    const onPageShow = (e: PageTransitionEvent) => {
      // Some browsers restore pages from bfcache w/o running timers
      if (e.persisted) {
        const now = Date.now();
        const last =
          Number(localStorage.getItem(KEY)) || lastActivityRef.current;
        const idleFor = now - last;
        debug("pageshow (bfcache), idleFor", idleFor);
        if (idleFor >= idleMs) {
          refresh();
        }
      }
    };

    // Cross-tab sync
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY && e.newValue) {
        const ts = Number(e.newValue);
        if (!Number.isNaN(ts)) {
          lastActivityRef.current = ts;
          debug("storage sync activity", ts);
        }
      }
    };

    // BroadcastChannel is nicer than storage when available
    try {
      bcRef.current = new BroadcastChannel("cryptnote-activity");
      bcRef.current.onmessage = (msg) => {
        if (msg?.data?.type === "activity" && typeof msg.data.ts === "number") {
          lastActivityRef.current = msg.data.ts;
          debug("broadcast sync activity", msg.data.ts);
        }
      };
    } catch {
      bcRef.current = null;
    }

    // Bind activity events
    const EVENTS: (keyof WindowEventMap)[] = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "scroll",
      "click",
      "pointerdown",
    ];
    EVENTS.forEach((ev) =>
      window.addEventListener(ev, onUserActivity, { passive: true })
    );

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("pageshow", onPageShow);
    window.addEventListener("storage", onStorage);

    // Initial mark + interval
    setLastActivity();
    intervalRef.current = window.setInterval(
      checkIdle,
      10_000
    ) as unknown as number; // check every 10s

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      EVENTS.forEach((ev) => window.removeEventListener(ev, onUserActivity));
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("pageshow", onPageShow);
      window.removeEventListener("storage", onStorage);
      try {
        bcRef.current?.close();
      } catch {}
    };
  }, [enabled, idleMs, hardReload, log, router]);

  return null;
}
