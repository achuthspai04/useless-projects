/**
 * Scatters items across a cell grid as non-overlapping `cardCols` x `cardRows` patches. Spots are
 * drawn at random and rejected if they'd overlap one already taken; once a draw keeps colliding
 * (a busy board), it falls back to a plain scan for the first free spot so an item is never
 * silently dropped. Shared by every reveal that scatters cards over the flooded tetris board (see
 * DateCards and VenueCards in curiosity-reveal.tsx) rather than duplicated per card type.
 */
export function scatterPlacements<T>(
  items: readonly T[],
  { columns, rows, cardCols, cardRows }: { columns: number; rows: number; cardCols: number; cardRows: number }
): (T & { col: number; row: number })[] {
  const maxCol = columns - cardCols;
  const maxRow = rows - cardRows;
  if (maxCol < 0 || maxRow < 0) return [];

  const taken: { col: number; row: number }[] = [];
  const free = (col: number, row: number) =>
    !taken.some(
      (t) => col < t.col + cardCols && col + cardCols > t.col && row < t.row + cardRows && row + cardRows > t.row
    );

  const placed: (T & { col: number; row: number })[] = [];
  for (const item of items) {
    let spot: { col: number; row: number } | null = null;
    for (let attempt = 0; attempt < 300 && !spot; attempt++) {
      const col = Math.floor(Math.random() * (maxCol + 1));
      const row = Math.floor(Math.random() * (maxRow + 1));
      if (free(col, row)) spot = { col, row };
    }
    for (let row = 0; row <= maxRow && !spot; row++) {
      for (let col = 0; col <= maxCol && !spot; col++) {
        if (free(col, row)) spot = { col, row };
      }
    }
    if (spot) {
      taken.push(spot);
      placed.push({ ...item, ...spot });
    }
  }
  return placed;
}
