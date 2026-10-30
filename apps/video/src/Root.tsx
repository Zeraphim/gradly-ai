import { Composition } from "remotion";
import { Gradly90 } from "./Gradly90";
import { GradlyWalkthrough, WALKTHROUGH_FRAMES } from "./GradlyWalkthrough";
import { FPS, HEIGHT, WIDTH } from "./theme";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Gradly90"
        component={Gradly90}
        durationInFrames={90 * FPS}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
      <Composition
        id="GradlyWalkthrough"
        component={GradlyWalkthrough}
        durationInFrames={WALKTHROUGH_FRAMES}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
