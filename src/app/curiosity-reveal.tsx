"use client";

import { useState } from "react";
import LegoBlock, { LEGO_COLOR_NAMES, type LegoColor } from "./lego-block";

// Figma node 337:386 ("Frame 74") is the single date-card reference (Drowner "sep" + big date
// number, a wavy-underlined "slot N" tag) - this is that card repeated once per event day.
const SCHEDULE = [
  { day: "03", slot: 1 },
  { day: "04", slot: 1 },
  { day: "05", slot: 1 },
  { day: "06", slot: 1 },
  { day: "11", slot: 2 },
  { day: "12", slot: 2 },
  { day: "13", slot: 2 },
] as const;

const POP_ROW_STAGGER_MS = 40;
// The "sep"/date-number tracking in the Figma card is 4% of its own font size (4px at 100px, 2px
// at 50px - the same ratio), kept as one constant so both scale together.
const LABEL_TRACKING_RATIO = 0.04;

/** Deterministic per-cell colour so the background tiling doesn't reshuffle on every re-render. */
function colorFor(col: number, row: number): LegoColor {
  return LEGO_COLOR_NAMES[(col * 7 + row * 13) % LEGO_COLOR_NAMES.length];
}

export default function CuriosityReveal({
  width,
  height,
  targetCell,
  buttonTop,
  buttonWidth,
  buttonHeight,
  buttonFontSize,
}: {
  /** Reference canvas size this section renders at (matches the caller's own REF_WIDTH/HEIGHT or
   *  MOBILE_WIDTH/HEIGHT) - the lego grid is built directly from these rather than measuring
   *  itself, since the caller's own CSS `scale()` transform doesn't change this layout box. */
  width: number;
  height: number;
  /** Preferred cell size in px - bigger than the background skyline's own 60px cells, so the date
   *  text stays legible. Column count is derived from it, same idea as TetrisField's targetCell. */
  targetCell: number;
  buttonTop: number;
  buttonWidth: number;
  buttonHeight: number;
  buttonFontSize: number;
}) {
  const [revealed, setRevealed] = useState(false);

  const columns = Math.max(6, Math.round(width / targetCell));
  const cell = width / columns;
  const rows = Math.max(4, Math.ceil(height / cell));

  // The 7 date cards sit as a centred 4-wide block: Slot 1's four days on top, Slot 2's three
  // days on the row directly below, left-aligned under the first three of those four columns.
  const cardCols = 4;
  const startCol = Math.floor((columns - cardCols) / 2);
  const topRow = Math.max(0, Math.floor(rows / 2) - 1);
  const bottomRow = topRow + 1;

  const cardAt = (col: number, row: number) => {
    if (row === topRow && col >= startCol && col < startCol + 4) return SCHEDULE[col - startCol];
    if (row === bottomRow && col >= startCol && col < startCol + 3) return SCHEDULE[4 + (col - startCol)];
    return null;
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className={`font-nanum-pen absolute left-1/2 -translate-x-1/2 cursor-pointer items-center justify-center bg-black text-white shadow-md transition-all duration-200 ease-out hover:-translate-y-1 hover:scale-[1.04] hover:bg-[#1a1a1a] active:translate-y-0.5 active:scale-[0.97] select-none ${
          revealed ? "pointer-events-none opacity-0" : "flex opacity-100"
        }`}
        style={{ top: buttonTop, width: buttonWidth, height: buttonHeight, fontSize: buttonFontSize }}
      >
        curiosity?
      </button>

      {revealed && (
        <div className="absolute inset-0 z-10">
          {Array.from({ length: rows }, (_, row) =>
            Array.from({ length: columns }, (_, col) => {
              const card = cardAt(col, row);
              const style = {
                left: col * cell,
                top: row * cell,
                width: cell - 1,
                height: cell - 1,
                animationDelay: `${row * POP_ROW_STAGGER_MS}ms`,
              };

              if (!card) {
                return (
                  <LegoBlock
                    key={`${col}-${row}`}
                    shape="stud"
                    color={colorFor(col, row)}
                    className="animate-lego-pop absolute"
                    style={style}
                  />
                );
              }

              return (
                <div
                  key={`${col}-${row}`}
                  className="animate-lego-pop absolute flex flex-col items-center justify-center bg-white"
                  style={style}
                >
                  <p
                    className="font-helvetica lowercase text-[#242525]"
                    style={{
                      fontSize: cell * 0.15,
                      transform: "rotate(-5.67deg)",
                      textDecoration: "underline wavy",
                      textDecorationSkipInk: "none",
                      textUnderlinePosition: "from-font",
                    }}
                  >
                    slot {card.slot}
                  </p>
                  <p
                    className="font-drowner leading-none text-black"
                    style={{ fontSize: cell * 0.22, letterSpacing: cell * 0.22 * LABEL_TRACKING_RATIO }}
                  >
                    sep
                  </p>
                  <p
                    className="font-drowner leading-none text-black"
                    style={{ fontSize: cell * 0.42, letterSpacing: cell * 0.42 * LABEL_TRACKING_RATIO }}
                  >
                    {card.day}
                  </p>
                </div>
              );
            })
          )}

          <button
            type="button"
            aria-label="Close"
            onClick={() => setRevealed(false)}
            className="font-nanum-pen absolute z-20 flex items-center justify-center rounded-full bg-black text-white shadow-md"
            style={{ right: cell * 0.3, top: cell * 0.3, width: cell * 0.7, height: cell * 0.7, fontSize: cell * 0.4 }}
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
