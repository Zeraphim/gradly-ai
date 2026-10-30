import { Audio, interpolate, staticFile, useVideoConfig } from "remotion";

/**
 * Music bed.
 *
 * Both tracks are Mixkit stock music under the Mixkit Free License
 * (`https://mixkit.co/license/#musicFree` — free for commercial use, no
 * attribution). They are PLACEHOLDERS chosen by metadata (length, tempo,
 * energy curve), not by ear — swap `public/music/*.mp3` before shipping.
 *
 * The film carries no voiceover yet, so the bed sits high in the mix
 * (≈ −21 dB mean) with a slow fade in and out rather than being ducked.
 */
export const Music: React.FC<{ file: string; gain?: number; fadeIn?: number; fadeOut?: number }> = ({
  file,
  gain = 0.65,
  fadeIn = 45,
  fadeOut = 90,
}) => {
  const { durationInFrames } = useVideoConfig();

  return (
    <Audio
      src={staticFile(file)}
      volume={(frame) => {
        const rise = interpolate(frame, [0, fadeIn], [0, gain], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const fall = interpolate(frame, [durationInFrames - fadeOut, durationInFrames - 2], [gain, 0], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        return Math.min(rise, fall);
      }}
    />
  );
};
