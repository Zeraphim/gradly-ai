import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { createElement } from "react";
import { createApp } from "../apps/api/src/app.js";
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

test("learner completes six quests, revises a wrong answer, and resumes saved progress", async () => {
  const { render, screen, waitFor, fireEvent, cleanup } =
    await import("@testing-library/react");
  const { userEvent } = await import("@testing-library/user-event");
  const { App } = await import("../apps/web/src/App.js");
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
    render(createElement(App));
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
    await user.click(screen.getByRole("button", { name: /^Continue$/ }));
    cleanup();
    render(createElement(App));
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
  } finally {
    cleanup();
    globalThis.fetch = originalFetch;
    await new Promise<void>((resolve, reject) =>
      server.close((e) => (e ? reject(e) : resolve())),
    );
    dom.window.close();
  }
});
