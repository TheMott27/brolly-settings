/**
 * PebbleColorPicker
 * Design: Dark theme with teal accents
 * Shows the 64-colour Pebble palette as an 8×8 grid in a popover.
 * Selecting a colour closes the popover and calls onChange with the hex value.
 */

import { useState, useRef, useEffect } from "react";

// Full 64-colour Pebble palette (8×8 grid, row-major order)
// Each entry is [r, g, b] mapped to the nearest Pebble colour.
// Pebble uses 2 bits per channel: 0, 85, 170, 255.
const PEBBLE_PALETTE: string[] = (() => {
  const levels = [0, 85, 170, 255];
  const colours: string[] = [];
  for (let r = 0; r < 4; r++) {
    for (let g = 0; g < 4; g++) {
      for (let b = 0; b < 4; b++) {
        const hex = (
          "#" +
          levels[r].toString(16).padStart(2, "0") +
          levels[g].toString(16).padStart(2, "0") +
          levels[b].toString(16).padStart(2, "0")
        ).toUpperCase();
        colours.push(hex);
      }
    }
  }
  return colours;
})();

// Snap an arbitrary hex to the nearest Pebble palette colour
function snapToPebble(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const snap = (v: number) => {
    const levels = [0, 85, 170, 255];
    return levels.reduce((prev, cur) =>
      Math.abs(cur - v) < Math.abs(prev - v) ? cur : prev
    );
  };
  return (
    "#" +
    snap(r).toString(16).padStart(2, "0") +
    snap(g).toString(16).padStart(2, "0") +
    snap(b).toString(16).padStart(2, "0")
  ).toUpperCase();
}

// Determine if a colour is "dark" (needs white label)
function isDark(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 < 128;
}

interface Props {
  value: string;
  onChange: (hex: string) => void;
}

export function PebbleColorPicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const snapped = snapToPebble(value);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  return (
    <div className="relative inline-block" ref={ref}>
      {/* Swatch button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-12 h-10 rounded border border-slate-600 outline outline-1 outline-white cursor-pointer transition-transform active:scale-95"
        style={{ backgroundColor: snapped }}
        aria-label={`Pick colour, current: ${snapped}`}
      />

      {/* Popover grid */}
      {open && (
        <div
          className="absolute z-50 right-0 mt-2 p-2 bg-slate-900 border border-slate-600 rounded-lg shadow-2xl"
          style={{ width: "auto" }}
        >
          <div
            className="grid gap-1"
            style={{ gridTemplateColumns: "repeat(8, 1fr)" }}
          >
            {PEBBLE_PALETTE.map((colour) => (
              <button
                key={colour}
                type="button"
                onClick={() => {
                  onChange(colour.toLowerCase());
                  setOpen(false);
                }}
                className="w-7 h-7 rounded-sm border transition-transform hover:scale-110 active:scale-95"
                style={{
                  backgroundColor: colour,
                  borderColor:
                    colour === snapped ? "white" : "rgba(255,255,255,0.15)",
                  boxShadow:
                    colour === snapped ? "0 0 0 2px #14b8a6" : undefined,
                }}
                title={colour}
                aria-label={colour}
                aria-pressed={colour === snapped}
              />
            ))}
          </div>
          {/* Selected colour preview */}
          <div className="mt-2 flex items-center gap-2">
            <div
              className="w-5 h-5 rounded border border-slate-500"
              style={{ backgroundColor: snapped }}
            />
            <span
              className="text-xs font-mono"
              style={{ color: isDark(snapped) ? "#94a3b8" : snapped }}
            >
              {snapped}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
