// Shared range-picker wiring.
//
// The picker is a native input[type="range"] laid over a drawn pill with one notch per stop and a thumb positioned by `--range-value`. The input keeps keyboard, pointer, and assistive-tech semantics; this helper only mirrors its value into the CSS variable, the aria-valuetext, and the <output>.

export interface RangeStop {
  /** Text for the <output> and aria-valuetext. */
  label: string;
}

export interface RangePickerOptions<Stop extends RangeStop> {
  input: HTMLInputElement;
  well: HTMLElement;
  output?: HTMLOutputElement | null;
  stops: readonly Stop[];
  onChange: (stop: Stop, index: number) => void;
}

export function bindRangePicker<Stop extends RangeStop>(options: RangePickerOptions<Stop>): () => void {
  const { input, well, output, stops, onChange } = options;
  well.style.setProperty("--range-stops", String(stops.length));

  const sync = () => {
    const index = Math.min(stops.length - 1, Math.max(0, Number(input.value)));
    const stop = stops[index];
    well.style.setProperty("--range-value", String(index));
    input.setAttribute("aria-valuetext", stop.label);
    if (output) {
      output.value = stop.label;
      output.textContent = stop.label;
    }
    onChange(stop, index);
  };

  input.addEventListener("input", sync);

  // Snap to the nearest stop on a bare pointer press, so tapping a notch works even when the browser would otherwise treat it as the start of a drag.
  well.addEventListener("pointerdown", (event) => {
    const bounds = well.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (event.clientX - bounds.left) / bounds.width));
    input.value = String(Math.round(ratio * (stops.length - 1)));
    input.dispatchEvent(new Event("input", { bubbles: true }));
  });

  sync();
  return sync;
}
