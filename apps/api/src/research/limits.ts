export function uploadLimit() {
  const configured = Number(process.env.MAX_UPLOAD_BYTES);
  return Math.min(
    Number.isFinite(configured) && configured > 0 ? configured : 4000000,
    4000000,
  );
}
