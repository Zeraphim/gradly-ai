// @vitest-environment jsdom
import { afterEach, expect, it, vi } from "vitest";
import { syncFlowConnectors } from "../../apps/web/src/research/scenes/flow-connectors.js";

function frameClock() {
  let now = 0,
    id = 0;
  const pending = new Map<number, FrameRequestCallback>();
  return {
    pending,
    now: () => now,
    request: (fn: FrameRequestCallback) => {
      pending.set(++id, fn);
      return id;
    },
    cancel: (key: number) => {
      pending.delete(key);
    },
    step(value: number) {
      now = value;
      const callbacks = [...pending.values()];
      pending.clear();
      callbacks.forEach((fn) => fn(now));
    },
  };
}
function fixture() {
  const host = document.createElement("div");
  host.innerHTML =
    '<button data-scene-node="from"></button><button data-scene-node="to"></button><svg><path data-scene-edge="0" /></svg>';
  document.body.append(host);
  let movingRight = 90;
  Object.defineProperties(host, {
    clientWidth: { value: 200 },
    clientHeight: { value: 100 },
  });
  // A scaled ancestor doubles all screen coordinates. Paths still use local units.
  vi.spyOn(host, "getBoundingClientRect").mockImplementation(() => ({
    left: 10,
    top: 20,
    width: 400,
    height: 200,
    right: 410,
    bottom: 220,
    x: 10,
    y: 20,
    toJSON() {},
  }));
  vi.spyOn(
    host.querySelector("button")!,
    "getBoundingClientRect",
  ).mockImplementation(() => ({
    left: 30,
    top: 40,
    width: movingRight - 30,
    height: 40,
    right: movingRight,
    bottom: 80,
    x: 30,
    y: 40,
    toJSON() {},
  }));
  vi.spyOn(
    host.querySelectorAll("button")[1]!,
    "getBoundingClientRect",
  ).mockImplementation(() => ({
    left: 210,
    top: 40,
    width: 80,
    height: 40,
    right: 290,
    bottom: 80,
    x: 210,
    y: 40,
    toJSON() {},
  }));
  return {
    host,
    path: host.querySelector("path")!,
    move: (value: number) => {
      movingRight = value;
    },
  };
}
afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it("uses the browser receiver for native frame scheduling and cleanup", () => {
  const { host } = fixture();
  const request = vi
    .spyOn(window, "requestAnimationFrame")
    .mockImplementation(function (this: Window) {
      expect(this).toBe(window);
      return 42;
    });
  const cancel = vi
    .spyOn(window, "cancelAnimationFrame")
    .mockImplementation(function (this: Window, id: number) {
      expect(this).toBe(window);
      expect(id).toBe(42);
    });
  const sync = syncFlowConnectors(host, [], false);
  expect(request).toHaveBeenCalledOnce();
  sync.dispose();
  expect(cancel).toHaveBeenCalledOnce();
});

it("follows transformed node boundaries mid-animation, coalesces tracking and stops after its bounded window", () => {
  const { host, path, move } = fixture();
  const clock = frameClock();
  const sync = syncFlowConnectors(
    host,
    [{ from: "from", to: "to" }],
    false,
    clock,
  );
  expect(path.getAttribute("d")).toBe("M40,20 C70,20 70,20 100,20");
  sync.track();
  sync.track();
  sync.track();
  expect(clock.pending.size).toBe(1);
  move(130);
  clock.step(100);
  expect(path.getAttribute("d")).toBe("M60,20 C80,20 80,20 100,20");
  expect(clock.pending.size).toBe(1);
  move(170);
  clock.step(300);
  expect(path.getAttribute("d")).toBe("M80,20 C90,20 90,20 100,20");
  clock.step(451);
  expect(clock.pending.size).toBe(0);
  sync.dispose();
});

it("disconnects observers and cancels queued measurements on teardown", () => {
  const observe = vi.fn(),
    disconnect = vi.fn();
  let resize!: () => void;
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(callback: () => void) {
        resize = callback;
      }
      observe = observe;
      disconnect = disconnect;
    },
  );
  const { host, path, move } = fixture();
  const clock = frameClock();
  const sync = syncFlowConnectors(
    host,
    [{ from: "from", to: "to" }],
    false,
    clock,
  );
  expect(observe).toHaveBeenCalledTimes(3);
  resize();
  sync.track();
  expect(clock.pending.size).toBe(1);
  sync.dispose();
  expect(disconnect).toHaveBeenCalledOnce();
  expect(clock.pending.size).toBe(0);
  const previous = path.getAttribute("d");
  move(160);
  resize();
  sync.track();
  window.dispatchEvent(new Event("resize"));
  clock.step(100);
  expect(clock.pending.size).toBe(0);
  expect(path.getAttribute("d")).toBe(previous);
});

it("samples settled reduced-motion geometry without a continuous frame loop", () => {
  const { host, path, move } = fixture();
  const clock = frameClock();
  const sync = syncFlowConnectors(
    host,
    [{ from: "from", to: "to" }],
    true,
    clock,
  );
  clock.step(0); // The one post-commit sample is not an animation loop.
  move(130);
  sync.track();
  expect(path.getAttribute("d")).toContain("M60,20");
  expect(clock.pending.size).toBe(0);
  window.dispatchEvent(new Event("resize"));
  expect(clock.pending.size).toBe(1);
  clock.step(20);
  expect(clock.pending.size).toBe(0);
  sync.dispose();
});

it("clears a path when its endpoint disappears instead of leaving a stale connection", () => {
  const { host, path } = fixture();
  const sync = syncFlowConnectors(
    host,
    [{ from: "from", to: "to" }],
    true,
    frameClock(),
  );
  host.querySelectorAll("button")[1]!.remove();
  sync.measure();
  expect(path.getAttribute("d")).toBe("");
  sync.dispose();
});

it("updates its Motion-value bridge with the same command written for the current paint", () => {
  const { host, path, move } = fixture();
  const clock = frameClock();
  const updateValue = vi.fn();
  const sync = syncFlowConnectors(
    host,
    [{ from: "from", to: "to" }],
    false,
    clock,
    updateValue,
  );
  sync.track();
  move(130);
  clock.step(100);
  expect(updateValue).toHaveBeenLastCalledWith(0, path.getAttribute("d"));
  expect(path.getAttribute("d")).toContain("M60,20");
  sync.dispose();
});
