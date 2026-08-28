"use client";

import { useState } from "react";
import TetrisField, { MAX_COLUMNS, MIN_COLUMNS } from "./tetris-field";

// Figma node 337:386 ("Frame 74") is the single date-card reference (Drowner "sep" + big date
// number, a wavy-underlined "slot N" tag), built from a 2-wide x 3-tall block of lego cells - six
// cells turned white - rather than one cell each. Repeated once per event day.
const SCHEDULE = [
  { day: "03", slot: 1 },
  { day: "04", slot: 1 },
  { day: "05", slot: 1 },
  { day: "06", slot: 1 },
  { day: "11", slot: 2 },
  { day: "12", slot: 2 },
  { day: "13", slot: 2 },
] as const;

const CARD_COLS = 2;
const CARD_ROWS = 3;
// The "sep"/date-number tracking in the Figma card is 4% of its own font size (4px at 100px, 2px
// at 50px - the same ratio), kept as one constant so both scale together.
const LABEL_TRACKING_RATIO = 0.04;

/** Same column/cell math TetrisField itself uses, reproduced here so the card overlay lands
 *  exactly on its grid rather than an independently-computed one that could drift a pixel off. */
function gridFor(width: number, targetCell: number) {
  const columns = Math.min(MAX_COLUMNS, Math.max(MIN_COLUMNS, Math.round(width / targetCell)));
  return { columns, cell: width / columns };
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
   *  MOBILE_WIDTH/HEIGHT) - the card overlay is built directly from these rather than measuring
   *  itself, since the caller's own CSS `scale()` transform doesn't change this layout box. */
  width: number;
  height: number;
  /** Passed straight through to TetrisField, and reused here to line the cards up with its grid. */
  targetCell: number;
  buttonTop: number;
  buttonWidth: number;
  buttonHeight: number;
  buttonFontSize: number;
}) {
  const [revealed, setRevealed] = useState(false);

  const { columns, cell } = gridFor(width, targetCell);
  const rows = Math.max(CARD_ROWS * 2, Math.floor(height / cell));

  // Slot 1's four cards form an 8-column-wide row; Slot 2's three sit directly below, centred
  // under that row. Both blocks together are vertically centred in the field.
  const slot1Width = 4 * CARD_COLS;
  const slot2Width = 3 * CARD_COLS;
  const startCol = Math.max(0, Math.floor((columns - slot1Width) / 2));
  const slot2StartCol = startCol + Math.floor((slot1Width - slot2Width) / 2);
  const blockHeight = CARD_ROWS * 2;
  const topRow = Math.max(0, Math.floor((rows - blockHeight) / 2));

  const cards = SCHEDULE.map((entry, i) => {
    const inSlot1 = i < 4;
    const col = (inSlot1 ? startCol : slot2StartCol) + (inSlot1 ? i : i - 4) * CARD_COLS;
    const row = topRow + (inSlot1 ? 0 : CARD_ROWS);
    return { ...entry, col, row };
  });

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
        <div className="absolute inset-0 z-10 overflow-hidden">
          {/* The exact same falling/landing tetris field as the hero, just given this section's
              own size - blocks drop and stack here precisely the way they do there. */}
          <TetrisField targetCell={targetCell} prefill={0.85} />

          {cards.map((card) => (
            <div
              key={card.day}
              className="animate-lego-pop absolute flex flex-col items-center justify-center bg-white"
              style={{
                left: card.col * cell,
                top: card.row * cell,
                width: CARD_COLS * cell - 1,
                height: CARD_ROWS * cell - 1,
              }}
            >
              <p
                className="font-helvetica lowercase text-[#242525]"
                style={{
                  fontSize: cell * 0.32,
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
                style={{ fontSize: cell * 0.45, letterSpacing: cell * 0.45 * LABEL_TRACKING_RATIO }}
              >
                sep
              </p>
              <p
                className="font-drowner leading-none text-black"
                style={{ fontSize: cell * 0.85, letterSpacing: cell * 0.85 * LABEL_TRACKING_RATIO }}
              >
                {card.day}
              </p>
            </div>
          ))}

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
