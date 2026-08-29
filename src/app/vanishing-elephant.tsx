"use client";

import { useState } from "react";
import AnimatedElephant from "./animated-elephant";

// Mirrors the touch-to-hide beat the celebrating-section pets already play: a tap makes the
// creature vanish briefly, then it pops back at the same spot.
const HIDE_MS = 550;

export default function VanishingElephant(props: React.ComponentProps<typeof AnimatedElephant>) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <AnimatedElephant
      {...props}
      ariaLabel="Poke the pet"
      onClick={() => {
        setVisible(false);
        setTimeout(() => setVisible(true), HIDE_MS);
      }}
    />
  );
}
