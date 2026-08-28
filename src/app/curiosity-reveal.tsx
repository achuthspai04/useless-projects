"use client";

import { useMemo } from "react";
import TetrisField from "./tetris-field";

// Figma node 337:386 ("Frame 74"), reproduced at its own 120x180 size and scaled to whatever the
// lego grid gives it - that frame is 2:3, which is exactly a 2-cell x 3-cell patch of the board.
const CARD_REF_WIDTH = 120;
const CARD_REF_HEIGHT = 180;

const SCHEDULE = [
  { day: "03", slot: 1 },
  { day: "04", slot: 1 },
  { day: "05", slot: 1 },
  { day: "06", slot: 1 },
  { day: "11", slot: 2 },
  { day: "12", slot: 2 },
  { day: "13", slot: 2 },
] as const;

/** One date card, laid out in the Figma frame's own coordinates and scaled as a whole. */
function DateCard({ slot, day, scale }: { slot: number; day: string; scale: number }) {
  return (
    <div
      style={{
        width: CARD_REF_WIDTH,
        height: CARD_REF_HEIGHT,
        transform: `scale(${scale})`,
        transformOrigin: "top left",
      }}
    >
      <div
        className="absolute flex items-center justify-center"
        style={{
          left: `calc(50% - 30.27px)`,
          top: "8px",
          width: "43.469px",
          height: "30.921px",
          transform: "translateX(-50%)",
        }}
      >
        <p
          className="font-helvetica flex-none text-center lowercase"
          style={{
            width: "41px",
            transform: "rotate(-5.67deg)",
            fontSize: "19.078px",
            lineHeight: 1.4,
            letterSpacing: "-1.717px",
            color: "#242525",
            textDecoration: "underline wavy",
            textDecorationSkipInk: "none",
            textUnderlinePosition: "from-font",
          }}
        >
          slot {slot}
        </p>
      </div>

      <div className="absolute" style={{ left: "11px", top: "47px", width: "91px", height: "144px" }}>
        <p
          className="font-drowner absolute text-black"
          style={{ left: 0, right: 0, top: 0, fontSize: "50px", letterSpacing: "2px", lineHeight: "normal" }}
        >
          sep
        </p>
        <p
          className="font-drowner absolute text-black"
          style={{
            left: 0,
            top: "34px",
            width: "97px",
            height: "121px",
            fontSize: "100px",
            letterSpacing: "4px",
            lineHeight: "normal",
          }}
        >
          {day}
        </p>
      </div>
    </div>
  );
}

/**
 * The cards as patches of the lego board, scattered across it: each covers `cardCols` x `cardRows`
 * cells and leaves the same one-unit seam between neighbours that the studs do. Spots are drawn at
 * random and rejected if they'd overlap one already taken, so the dates land somewhere different
 * every time without ever sitting on top of each other.
 */
function DateCards({
  columns,
  rows,
  cell,
  unit,
  cardCols,
  cardRows,
}: {
  columns: number;
  rows: number;
  cell: number;
  unit: number;
  cardCols: number;
  cardRows: number;
}) {
  const placed = useMemo(() => {
    const taken: { col: number; row: number }[] = [];
    const maxCol = columns - cardCols;
    const maxRow = rows - cardRows;
    const free = (col: number, row: number) =>
      !taken.some(
        (t) =>
          col < t.col + cardCols && col + cardCols > t.col && row < t.row + cardRows && row + cardRows > t.row
      );

    return SCHEDULE.map((entry) => {
      let spot: { col: number; row: number } | null = null;
      for (let attempt = 0; attempt < 300 && !spot; attempt++) {
        const col = Math.floor(Math.random() * (maxCol + 1));
        const row = Math.floor(Math.random() * (maxRow + 1));
        if (free(col, row)) spot = { col, row };
      }
      // Random draws can keep colliding once the board is busy; fall back to the first free spot
      // in a plain scan so a date is never silently dropped.
      for (let row = 0; row <= maxRow && !spot; row++) {
        for (let col = 0; col <= maxCol && !spot; col++) {
          if (free(col, row)) spot = { col, row };
        }
      }
      if (spot) taken.push(spot);
      return spot ? { ...entry, ...spot } : null;
    }).filter((c): c is (typeof SCHEDULE)[number] & { col: number; row: number } => c !== null);
  }, [columns, rows, cardCols, cardRows]);

  const width = cardCols * cell - unit;

  return (
    <>
      {placed.map((card) => (
        <div
          key={card.day}
          className="animate-lego-pop absolute overflow-hidden bg-white"
          style={{
            left: card.col * cell,
            bottom: card.row * cell,
            width,
            height: cardRows * cell - unit,
          }}
        >
          <DateCard slot={card.slot} day={card.day} scale={width / CARD_REF_WIDTH} />
        </div>
      ))}
    </>
  );
}

// The "know when?" reveal: fills the whole section with the tetris board's finished state - the
// exact same TetrisField the hero runs, rendered in its flooded end state (see the `flooded` prop)
// rather than reimplemented here - and then scatters the event dates across it. The caller drives
// the sequencing (board, then cards, then back to the section); this just renders a given step.
export default function CuriosityReveal({
  targetCell,
  cardCols,
  cardRows,
  showCards,
}: {
  /** Passed straight through to TetrisField - the hero uses 68 on desktop and 22 on mobile. */
  targetCell: number;
  /** Card footprint in cells. 2x3 matches the Figma frame's own 120x180 exactly; mobile scales
   *  both up together (keeping 2:3) so the cards stay legible against its much smaller cells. */
  cardCols: number;
  cardRows: number;
  showCards: boolean;
}) {
  return (
    <div className="absolute inset-0 z-10 overflow-hidden">
      <TetrisField
        targetCell={targetCell}
        flooded
        overlay={
          showCards
            ? (grid) => <DateCards {...grid} cardCols={cardCols} cardRows={cardRows} />
            : undefined
        }
      />
    </div>
  );
}
