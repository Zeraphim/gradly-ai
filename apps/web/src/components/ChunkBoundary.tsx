import React, { Component, type ReactNode } from "react";

/**
 * Catches a code-split section that fails to load or render (for example a
 * stale chunk after a deploy) and offers a reload instead of a blank page.
 */
export class ChunkBoundary extends Component<
  { label?: string; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <div className="error-message" role="alert">
        <p>
          {this.props.label ?? "This section"} couldn’t load. Reload the page to
          try again.
        </p>
        <button
          className="button neutral"
          onClick={() => window.location.reload()}
        >
          Reload page
        </button>
      </div>
    );
  }
}
