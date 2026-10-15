import React, { useSyncExternalStore } from "react";
function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback);
  return () => window.removeEventListener("hashchange", callback);
}
export function useResearchPath() {
  return useSyncExternalStore(
    subscribe,
    () => window.location.hash.replace(/^#\/research/, "") || "/",
    () => "/",
  );
}
export function useResearchRouter() {
  return {
    push: (path: string) => {
      window.location.hash = "/research" + path;
    },
  };
}
export function ResearchLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a {...props} href={href?.startsWith("/") ? "#/research" + href : href}>
      {children}
    </a>
  );
}
