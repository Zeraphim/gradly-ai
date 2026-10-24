/** Geometry is read as one batch, then written directly to the SVG paths.
 * No React state changes per frame. Tracking runs only for bounded motion windows.
 */
type Edge = { from: string; to: string };
type FrameClock = {
  request: (callback: FrameRequestCallback) => number;
  cancel: (id: number) => void;
  now: () => number;
};
const browserClock = (): FrameClock => ({
  request: (callback) => window.requestAnimationFrame(callback),
  cancel: (id) => window.cancelAnimationFrame(id),
  now: () => performance.now(),
});

export function syncFlowConnectors(
  host: HTMLElement,
  edges: Edge[],
  still: boolean,
  clock: FrameClock = browserClock(),
  updateValue?: (index: number, path: string) => void,
) {
  let frame: number | null = null;
  let until = 0;
  let disposed = false;
  const measure = () => {
    if (disposed) return;
    const box = host.getBoundingClientRect();
    if (!box.width || !box.height) return;
    const sx = (host.clientWidth || box.width) / box.width;
    const sy = (host.clientHeight || box.height) / box.height;
    const nodes = new Map(
      [...host.querySelectorAll<HTMLElement>("[data-scene-node]")].map((el) => [
        el.dataset.sceneNode!,
        el.getBoundingClientRect(),
      ]),
    );
    const paths = [
      ...host.querySelectorAll<SVGPathElement>("path[data-scene-edge]"),
    ];
    // Read all geometry before touching any path attributes.
    const commands = edges.map((edge) => {
      const from = nodes.get(edge.from),
        to = nodes.get(edge.to);
      if (!from || !to) return "";
      const vertical = to.top >= from.bottom;
      const x1 =
        ((vertical ? from.left + from.width / 2 : from.right) - box.left) * sx;
      const y1 =
        ((vertical ? from.bottom : from.top + from.height / 2) - box.top) * sy;
      const x2 =
        ((vertical ? to.left + to.width / 2 : to.left) - box.left) * sx;
      const y2 = ((vertical ? to.top : to.top + to.height / 2) - box.top) * sy;
      return vertical
        ? `M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}`
        : `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`;
    });
    paths.forEach((path, i) => {
      const command = commands[i] ?? "";
      updateValue?.(i, command);
      // Keep the Motion value and actual path in sync in this same paint. Waiting
      // for its next scheduled renderer would leave endpoints one frame behind.
      if (path.getAttribute("d") !== command) path.setAttribute("d", command);
    });
  };
  const tick: FrameRequestCallback = () => {
    frame = null;
    measure();
    if (!disposed && !still && clock.now() < until) frame = clock.request(tick);
  };
  const sample = () => {
    if (!disposed && frame === null) frame = clock.request(tick);
  };
  const track = () => {
    if (disposed) return;
    if (still) {
      measure();
      return;
    }
    until = Math.max(until, clock.now() + 450);
    sample();
  };
  const resized = () => sample();
  const observer =
    typeof ResizeObserver !== "undefined" ? new ResizeObserver(resized) : null;
  observer?.observe(host);
  for (const node of host.querySelectorAll("[data-scene-node]"))
    observer?.observe(node);
  window.addEventListener("resize", resized);
  measure();
  sample(); // Resample after ancestor layout/preference effects have settled.
  return {
    measure,
    track,
    dispose() {
      disposed = true;
      if (frame !== null) clock.cancel(frame);
      frame = null;
      observer?.disconnect();
      window.removeEventListener("resize", resized);
    },
  };
}
