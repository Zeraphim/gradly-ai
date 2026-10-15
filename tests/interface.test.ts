import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { createElement } from "react";
import { createApp } from "../apps/api/src/app.js";
import { newSession } from "@paperquest/lesson-state";
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
  "HTMLElement",
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

test("learner completes six quests, revises a wrong answer, and resumes saved progress", async (t) => {
  const { render, screen, waitFor, fireEvent, cleanup, act } =
    await import("@testing-library/react");
  const { userEvent } = await import("@testing-library/user-event");
  const { LegacyApp } = await import("../apps/web/src/LegacyApp.js");
  const server = createApp({ preview: true }).listen(0, "127.0.0.1");
  await new Promise<void>((resolve) => server.once("listening", resolve));
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  const base = `http://127.0.0.1:${address.port}`;
  const originalFetch = globalThis.fetch;
  let failedOnce = false;
  let injectFailure = true;
  globalThis.fetch = (input, init) => {
    const path = String(input);
    if (path === "/api/feedback" && injectFailure) {
      injectFailure = false;
      failedOnce = true;
      return Promise.resolve(
        new Response(
          JSON.stringify({
            error: {
              message: "Temporary provider failure. Your answer is saved.",
            },
          }),
          { status: 503, headers: { "Content-Type": "application/json" } },
        ),
      );
    }
    return originalFetch(path.startsWith("/") ? base + path : input, init);
  };
  const user = userEvent.setup({ document: dom.window.document });
  try {
    render(createElement(LegacyApp));
    assert.ok(screen.getByRole("button", { name: "Gradly home" }));
    assert.ok(document.querySelector('[data-pose="approving"]'));
    await user.click(
      screen.getByRole("button", { name: /Can you text and still learn/ }),
    );
    await waitFor(() =>
      assert.ok(
        !screen
          .getByRole("button", { name: /Let’s explore/ })
          .hasAttribute("disabled"),
      ),
    );
    await user.click(screen.getByRole("button", { name: /Let’s explore/ }));
    assert.ok(
      screen
        .getByRole("button", { name: /Check my reasoning/ })
        .hasAttribute("disabled"),
    );
    assert.equal(screen.queryByText("Evidence revealed"), null);
    assert.ok(document.querySelector('[data-pose="guiding"]'));
    await user.click(
      screen.getByRole("radio", { name: /Paired measurements/ }),
    );
    fireEvent.change(
      screen.getByRole("textbox", { name: /What makes you think/ }),
      {
        target: {
          value:
            "I think the measurements are paired because they heard the same lecture.",
        },
      },
    );
    await user.click(
      screen.getByRole("button", { name: /Check my reasoning/ }),
    );
    await waitFor(() =>
      assert.match(
        screen.getByRole("alert").textContent ?? "",
        /Temporary provider failure/,
      ),
    );
    assert.equal(
      (
        screen.getByRole("textbox", {
          name: /What makes you think/,
        }) as HTMLTextAreaElement
      ).value,
      "I think the measurements are paired because they heard the same lecture.",
    );
    assert.equal(screen.queryByText("Evidence revealed"), null);
    await user.click(screen.getByRole("button", { name: /Retry feedback/ }));
    await waitFor(() =>
      assert.ok(screen.getByText("Let’s make that reasoning stronger.")),
    );
    assert.ok(screen.getByText("Evidence revealed"));
    assert.ok(document.querySelector('[data-pose="caring"]'));
    assert.equal(screen.queryByRole("button", { name: /^Continue$/ }), null);
    await user.click(screen.getByRole("radio", { name: /Separate groups/ }));
    fireEvent.change(
      screen.getByRole("textbox", { name: /What makes you think/ }),
      {
        target: {
          value:
            "Different participants each contributed one score in one condition.",
        },
      },
    );
    await user.click(screen.getByRole("button", { name: /Check revision/ }));
    await waitFor(() =>
      assert.ok(screen.getByRole("button", { name: /^Continue$/ })),
    );
    assert.ok(document.querySelector('[data-pose="approving"]'));
    await user.click(screen.getByRole("button", { name: /^Continue$/ }));
    cleanup();
    render(createElement(LegacyApp));
    await waitFor(() =>
      assert.ok(screen.getByRole("button", { name: /Resume/ })),
    );
    await user.click(screen.getByRole("button", { name: /Resume/ }));
    await waitFor(() =>
      assert.ok(
        screen.getByRole("heading", { name: "Choose your comparison" }),
      ),
    );
    const choices = [
      /A separate-groups comparison/,
      /No-text scored 9.59 percentage points/,
      /We need the individual/,
      /Account for paired/,
      /Quiet-room scores average/,
    ];
    for (let i = 0; i < choices.length; i++) {
      assert.equal(
        (
          screen.getByRole("textbox", {
            name: /What makes you think/,
          }) as HTMLTextAreaElement
        ).value,
        "",
      );
      await user.click(screen.getByRole("radio", { name: choices[i]! }));
      fireEvent.change(
        screen.getByRole("textbox", { name: /What makes you think/ }),
        {
          target: {
            value:
              "This follows from the participants and outcome described in the question.",
          },
        },
      );
      await user.click(
        screen.getByRole("button", { name: /Check my reasoning/ }),
      );
      await waitFor(() =>
        assert.ok(
          screen.getByRole("button", {
            name: i === choices.length - 1 ? /Finish adventure/ : /^Continue$/,
          }),
        ),
      );
      await user.click(
        screen.getByRole("button", {
          name: i === choices.length - 1 ? /Finish adventure/ : /^Continue$/,
        }),
      );
    }
    assert.ok(
      screen.getByRole("heading", { name: "Curiosity, meet evidence." }),
    );
    assert.ok(screen.getByText("50 / 50"));
    assert.ok(document.querySelector('[data-pose="celebrating"]'));
    assert.ok(screen.getByText(/These results do not measure learning/));
    assert.ok(failedOnce);
    const saved = JSON.parse(localStorage.getItem("paperquest.session.v1")!);
    assert.equal(saved.current, 6);
    assert.equal(saved.questions["study-design"].attempts.length, 2);
    await user.click(screen.getByRole("button", { name: /My progress/ }));
    assert.ok(screen.getByRole("dialog", { name: /Your adventure progress/ }));
    fireEvent(
      screen.getByRole("dialog"),
      new dom.window.Event("cancel", { bubbles: false, cancelable: true }),
    );
    assert.equal(screen.queryByRole("dialog"), null);
    await t.test(
      "completed adventures offer review from the preserved hero",
      async () => {
        await user.click(screen.getByRole("button", { name: "Gradly home" }));
        assert.ok(screen.getByText("You completed this adventure."));
        assert.equal(
          screen.queryByText("You have an adventure in progress."),
          null,
        );
        assert.equal(screen.queryByRole("button", { name: /Resume/ }), null);
        await user.click(
          screen.getByRole("button", { name: "Review adventure" }),
        );
        assert.ok(
          screen.getByRole("heading", { name: "Curiosity, meet evidence." }),
        );
        assert.equal(screen.queryByRole("dialog"), null);
        assert.equal(
          JSON.parse(localStorage.getItem("paperquest.session.v1")!).current,
          6,
        );
      },
    );
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
            onResume: () => {},
            onResearchFile: () => {
              accepted++;
            },
            session: newSession(),
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
              onResume: () => {},
              session: newSession(),
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
    globalThis.fetch = originalFetch;
    await new Promise<void>((resolve, reject) =>
      server.close((e) => (e ? reject(e) : resolve())),
    );
    dom.window.close();
  }
});
