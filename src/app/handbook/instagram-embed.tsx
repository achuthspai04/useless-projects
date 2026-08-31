"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const EMBED_SCRIPT_SRC = "https://www.instagram.com/embed.js";

// Instagram's oEmbed widget only rewrites <blockquote class="instagram-media"> tags into the
// actual player when window.instgrm.Embeds.process() runs, so the script has to be (re)triggered
// on every mount rather than just loaded once.
export default function InstagramEmbed({ permalink }: { permalink: string }) {
  useEffect(() => {
    const process = () => window.instgrm?.Embeds.process();

    if (window.instgrm) {
      process();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${EMBED_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", process);
      return () => existing.removeEventListener("load", process);
    }

    const script = document.createElement("script");
    script.src = EMBED_SCRIPT_SRC;
    script.async = true;
    script.addEventListener("load", process);
    document.body.appendChild(script);
  }, [permalink]);

  return (
    // Instagram's non-captioned embed variant (omitting data-instgrm-captioned) never resizes
    // past a 2px-tall iframe - it appears to be broken/deprecated on their end - so the captioned
    // card is the only variant that actually renders and plays.
    <blockquote
      className="instagram-media"
      data-instgrm-captioned
      data-instgrm-permalink={permalink}
      data-instgrm-version="14"
      style={{ background: "#FFF", border: 0, margin: 0, maxWidth: 540, minWidth: 326, padding: 0, width: "100%" }}
    />
  );
}
