"use client";

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
 * The cards as patches of the lego board: each covers `cardCols` x `cardRows` cells, leaving the
 * same one-unit seam between neighbours that the studs do. Rows are chunked per slot so a slot
 * never straddles two rows, and each row is centred on the field.
 */
function DateCards({
  columns,
  rows,
  cell,
  unit,
  cardCols,
  cardRows,
  perRow,
}: {
  columns: number;
  rows: number;
  cell: number;
  unit: number;
  cardCols: number;
  cardRows: number;
  perRow: number;
}) {
  const lines: (typeof SCHEDULE)[number][][] = [];
  for (const slot of [1, 2]) {
    const inSlot = SCHEDULE.filter((s) => s.slot === slot);
    for (let i = 0; i < inSlot.length; i += perRow) lines.push(inSlot.slice(i, i + perRow));
  }

  const blockRows = lines.length * cardRows;
  // `bottom`-anchored like every other block on the board, so the stack of rows is centred and
  // then read top-down from there.
  const topRow = Math.max(0, Math.floor((rows - blockRows) / 2)) + blockRows;

  return (
    <>
      {lines.map((line, lineIndex) => {
        const startCol = Math.max(0, Math.floor((columns - line.length * cardCols) / 2));
        return line.map((card, i) => (
          <div
            key={card.day}
            className="animate-lego-pop absolute overflow-hidden bg-white"
            style={{
              left: (startCol + i * cardCols) * cell,
              bottom: (topRow - (lineIndex + 1) * cardRows) * cell,
              width: cardCols * cell - unit,
              height: cardRows * cell - unit,
            }}
          >
            <DateCard slot={card.slot} day={card.day} scale={(cardCols * cell - unit) / CARD_REF_WIDTH} />
          </div>
        ));
      })}
    </>
  );
}

// The "curiosity?" reveal: fills the whole section with the tetris board's finished state - the
// exact same TetrisField the hero runs, rendered in its flooded end state (see the `flooded` prop)
// rather than reimplemented here - with the event dates set into it as white patches.
export default function CuriosityReveal({
  targetCell,
  cardCols,
  cardRows,
  perRow,
  onClose,
}: {
  /** Passed straight through to TetrisField - the hero uses 68 on desktop and 22 on mobile. */
  targetCell: number;
  /** Card footprint in cells. 2x3 matches the Figma frame's own 120x180 exactly; mobile scales
   *  both up together (keeping 2:3) so the cards stay legible against its much smaller cells. */
  cardCols: number;
  cardRows: number;
  /** How many cards fit on one row before the slot wraps. */
  perRow: number;
  onClose: () => void;
}) {
  return (
    <div className="absolute inset-0 z-10 overflow-hidden">
      <TetrisField
        targetCell={targetCell}
        flooded
        overlay={(grid) => <DateCards {...grid} cardCols={cardCols} cardRows={cardRows} perRow={perRow} />}
      />
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
