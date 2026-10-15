export function Icon({
  name,
}: {
  name: "book" | "document" | "phone" | "check" | "star" | "retry";
}) {
  const paths = {
    book: (
      <>
        <path d="M12 6c-3-3-7-3-10-1v14c3-2 7-2 10 1 3-3 7-3 10-1V5c-3-2-7-2-10 1Z" />
        <path d="M12 6v14M5 9h4M5 12h4M15 9h4M15 12h4" />
      </>
    ),
    document: (
      <>
        <path d="M6 2h8l5 5v15H6Z" />
        <path d="M14 2v6h5M9 12h7M9 16h7" />
      </>
    ),
    phone: (
      <>
        <rect x="6" y="2" width="12" height="20" rx="2" />
        <path d="M9 5h6M10 18h4" />
        <circle cx="10" cy="9" r=".4" />
        <circle cx="14" cy="9" r=".4" />
        <path d="M10 12h4" />
      </>
    ),
    check: <path d="m4 12 5 5L20 6" />,
    star: <path d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1Z" />,
    retry: (
      <>
        <path d="M20 8a8 8 0 1 0 1 7M20 3v6h-6" />
      </>
    ),
  };
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
