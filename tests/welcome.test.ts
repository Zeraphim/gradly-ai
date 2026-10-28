import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { createElement } from "react";
function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((finish) => {
    resolve = finish;
  });
  return { promise, resolve };
}
const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost",
});
for (const name of [
  "window",
  "document",
  "navigator",
  "Element",
  "HTMLElement",
  "SVGElement",
  "HTMLInputElement",
  "HTMLTextAreaElement",
  "HTMLDialogElement",
  "Node",
  "MutationObserver",
  "localStorage",
])
  Object.defineProperty(globalThis, name, {
    value: (dom.window as unknown as Record<string, unknown>)[name],
    configurable: true,
  });
Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
dom.window.scrollTo = () => {};
Object.defineProperty(dom.window, "matchMedia", {
  value: (media: string) => ({
    media,
    matches: false,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  }),
});
Object.defineProperty(dom.window.HTMLDialogElement.prototype, "showModal", {
  value() {
    this.open = true;
  },
});
Object.defineProperty(dom.window.HTMLDialogElement.prototype, "close", {
  value() {
    this.open = false;
  },
});

test("Welcome ignores PDF validation callbacks after unmount", async (t) => {
  const { render, screen, waitFor, fireEvent, cleanup, act } =
    await import("@testing-library/react");
  try {
    await t.test(
      "a PDF header check cannot navigate after leaving the hero",
      async () => {
        cleanup();
        const { Welcome } =
          await import("../apps/web/src/components/Welcome.js");
        const header = deferred<ArrayBuffer>();
        let accepted = 0;
        const file = {
          name: "late-header.pdf",
          size: 12,
          slice: () => ({ arrayBuffer: () => header.promise }),
        } as unknown as File;
        render(
          createElement(Welcome, {
            onStart: () => {
              accepted++;
            },
            onResearchFile: () => {
              accepted++;
            },
          }),
        );
        fireEvent.change(document.querySelector('input[type="file"]')!, {
          target: { files: [file] },
        });
        assert.ok(screen.getByRole("button", { name: "Checking your paper…" }));
        cleanup();
        await act(async () => {
          header.resolve(new TextEncoder().encode("%PDF-").buffer);
          await header.promise;
        });
        assert.equal(accepted, 0);
      },
    );
    await t.test(
      "a successful delayed PDF digest cannot reopen a departed hero",
      async () => {
        cleanup();
        const { Welcome } =
          await import("../apps/web/src/components/Welcome.js");
        const digest = deferred<ArrayBuffer>();
        const cryptoDescriptor = Object.getOwnPropertyDescriptor(
          globalThis,
          "crypto",
        );
        let accepted = 0;
        let checking = false;
        Object.defineProperty(globalThis, "crypto", {
          configurable: true,
          value: {
            subtle: {
              digest: () => {
                checking = true;
                return digest.promise;
              },
            },
          },
        });
        try {
          const file = {
            name: "late-digest.pdf",
            size: 12,
            arrayBuffer: async () => new ArrayBuffer(12),
          } as unknown as File;
          render(
            createElement(Welcome, {
              onStart: () => {
                accepted++;
              },
            }),
          );
          fireEvent.change(document.querySelector('input[type="file"]')!, {
            target: { files: [file] },
          });
          await waitFor(() => assert.equal(checking, true));
          cleanup();
          await act(async () => {
            digest.resolve(
              Uint8Array.from(
                "6df5c8f670f4cf8ac0044e0f26111f479a130ce62d5a7d31d763ea5beee7b178".match(
                  /../g,
                )!,
                (hex) => Number.parseInt(hex, 16),
              ).buffer,
            );
            await digest.promise;
          });
          assert.equal(accepted, 0);
        } finally {
          cleanup();
          if (cryptoDescriptor)
            Object.defineProperty(globalThis, "crypto", cryptoDescriptor);
          else Reflect.deleteProperty(globalThis, "crypto");
        }
      },
    );
  } finally {
    cleanup();
    dom.window.close();
  }
});
