"use client";

import Image from "next/image";
import { useState } from "react";

// Same touch-to-hide beat as VanishingElephant, for the badge-style pets that render as a plain
// <Image> (e.g. the ele1 icon) instead of an AnimatedElephant burst loop.
const HIDE_MS = 550;

export default function VanishingImage(props: React.ComponentProps<typeof Image>) {
  const [visible, setVisible] = useState(true);
  const { style, ...rest } = props;

  if (!visible) return null;

  return (
    <Image
      {...rest}
      // pointerEvents: "auto" matters when this sits inside the desktop badge's
      // pointer-events-none parallax wrapper (see title.tsx) - without it, clicks pass straight
      // through to whatever's behind instead of reaching this image.
      style={{ ...style, cursor: "pointer", pointerEvents: "auto" }}
      role="button"
      aria-label="Poke the pet"
      onClick={() => {
        setVisible(false);
        setTimeout(() => setVisible(true), HIDE_MS);
      }}
    />
  );
}
