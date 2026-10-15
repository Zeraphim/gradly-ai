// Optional asset maintenance. Builds use the committed derivatives, not cwebp.
import { execFileSync } from "node:child_process";
import { statSync } from "node:fs";
import { fileURLToPath } from "node:url";

const brand = fileURLToPath(
  new URL("../apps/web/public/brand/", import.meta.url),
);
const assets = [
  ["gradly-logo.png", "gradly-logo.webp", 505, 480, 1740, 585],
  ...Object.entries({
    teaching: [102, 13, 408, 349],
    approving: [590, 14, 347, 347],
    reading: [1069, 11, 284, 356],
    celebrating: [111, 368, 371, 328],
    thinking: [610, 370, 323, 330],
    guiding: [1071, 369, 339, 336],
    caring: [156, 698, 325, 326],
    determined: [609, 701, 335, 323],
    studying: [1080, 705, 279, 319],
  }).map(([pose, rect]) => [
    "gradly-sprites.png",
    `mascot-${pose}.webp`,
    ...rect,
  ]),
];
for (const [source, output, ...rect] of assets) {
  execFileSync("cwebp", [
    "-quiet",
    "-lossless",
    "-exact",
    "-q",
    "100",
    "-m",
    "6",
    "-metadata",
    "icc",
    `${brand}${source}`,
    "-crop",
    ...rect.map(String),
    "-o",
    `${brand}${output}`,
  ]);
  console.log(`${output}: ${statSync(`${brand}${output}`).size} bytes`);
}
