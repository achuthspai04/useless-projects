"use client";

import TetrisField from "./tetris-field";

// The "curiosity?" reveal: fills the whole section with the tetris board's finished state - the
// exact same TetrisField the hero runs, rendered in its flooded end state (see the `flooded` prop)
// rather than reimplemented here.
export default function CuriosityReveal({
  targetCell,
  onClose,
}: {
  /** Passed straight through to TetrisField - the hero uses 68 on desktop and 22 on mobile. */
  targetCell: number;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-0 z-10 overflow-hidden">
      <TetrisField targetCell={targetCell} flooded />
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="font-nanum-pen absolute right-4 top-4 z-20 flex size-10 items-center justify-center rounded-full bg-black text-2xl text-white shadow-md"
      >
        ×
      </button>
    </div>
  );
}
