import { Config } from "@remotion/cli/config";

Config.setEntryPoint("src/index.ts");
// PNG, not JPEG: this film is mostly flat brand colour, and 8-bit JPEG blocks
// on near-white surfaces show up as a visible rectangle around the logo plate.
Config.setVideoImageFormat("png");
Config.setOverwriteOutput(true);
