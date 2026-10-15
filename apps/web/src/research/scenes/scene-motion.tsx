import {
  createContext,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  LayoutGroup,
  LazyMotion,
  MotionConfig,
  domMax,
  m,
  useIsPresent,
  animate,
  useResetProjection,
  type HTMLMotionProps,
  type MotionProps,
} from "motion/react";

export const sceneTiming = {
  layout: { type: "spring", duration: 0.28, bounce: 0 },
  copy: { duration: 0.16, ease: "easeOut" },
  gesture: { duration: 0.12, ease: "easeOut" },
  challenge: { duration: 0.22, ease: "easeOut" },
  chart: { duration: 0.3, ease: "easeOut" },
  connection: { duration: 0.22, ease: "easeOut" },
} satisfies Record<string, MotionProps["transition"]>;
const rest = { opacity: 1, y: 0, scale: 1 };
const motionContext = createContext<{
  still: boolean;
  hover: boolean;
  canEnter: () => boolean;
} | null>(null);

/** One feature owner per subtree; nested scenes only add an identity-scoped layout group. */
export function SceneMotion({
  reduced,
  children,
}: {
  reduced: boolean;
  children: ReactNode;
}) {
  const parent = useContext(motionContext);
  const id = useId();
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const inherited = useMemo(
    () =>
      parent
        ? { ...parent, canEnter: () => mounted.current && parent.canEnter() }
        : null,
    [parent],
  );
  if (inherited)
    return (
      <motionContext.Provider value={inherited}>
        <LayoutGroup id={id}>{children}</LayoutGroup>
      </motionContext.Provider>
    );
  return (
    <SceneMotionRoot reduced={reduced}>
      <LayoutGroup id={id}>{children}</LayoutGroup>
    </SceneMotionRoot>
  );
}
function SceneMotionRoot({
  reduced,
  children,
}: {
  reduced: boolean;
  children: ReactNode;
}) {
  const systemReduced = useMediaPreference("(prefers-reduced-motion: reduce)");
  const finePointer = useMediaPreference("(hover: hover) and (pointer: fine)");
  const scope = useRef<HTMLDivElement>(null);
  const resetProjection = useResetProjection();
  const mounted = useRef(false);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);
  const still = reduced || systemReduced;
  const previous = useRef(still);
  useLayoutEffect(() => {
    if (still && !previous.current && scope.current) {
      // This project uses Motion only for research scenes and their action dock.
      // Stop outstanding layout projections without remounting semantic state or focus.
      resetProjection();
      for (const element of scope.current.querySelectorAll<
        HTMLElement | SVGElement
      >(
        "[data-scene-layout], [data-scene-motion-control], [data-scene-settle], [data-scene-bar], [data-scene-path]",
      )) {
        const target: Record<string, number> = {
          opacity: Number(element.dataset.sceneOpacity ?? 1),
          x: 0,
          y: 0,
          scale: 1,
        };
        if (element.dataset.sceneRotate !== undefined)
          target.rotate = Number(element.dataset.sceneRotate);
        if (element.dataset.sceneBar !== undefined)
          target.scaleX = Number(element.dataset.sceneBar);
        if (element.dataset.scenePath !== undefined)
          target.pathLength = Number(element.dataset.scenePath);
        animate(element, target, { duration: 0 }).complete();
      }
    }
    previous.current = still;
  }, [still, resetProjection]);
  const context = useMemo(
    () => ({
      still,
      hover: finePointer && !still,
      canEnter: () => mounted.current && !still,
    }),
    [still, finePointer],
  );
  return (
    <motionContext.Provider value={context}>
      <div
        ref={scope}
        className="scene-motion-scope"
        data-scene-reduced={still}
      >
        <LazyMotion features={domMax} strict>
          <MotionConfig
            // Motion 14 snapshots its engine policy at mount. Our live preference
            // drives layout/gesture flags and settles active values in place.
            reducedMotion="never"
            transition={still ? { duration: 0 } : sceneTiming.layout}
          >
            {children}
          </MotionConfig>
        </LazyMotion>
      </div>
    </motionContext.Provider>
  );
}
export function useSceneMotion() {
  const context = useContext(motionContext);
  if (!context) throw Error("Scene motion needs its scoped provider.");
  return {
    ...context,
    layout: context.still ? (false as const) : (true as const),
    position: context.still ? (false as const) : ("position" as const),
    copy: context.still
      ? { duration: 0, layout: { duration: 0 } }
      : { ...sceneTiming.copy, layout: sceneTiming.layout },
    enter: context.canEnter() ? { opacity: 0, y: 4 } : (false as const),
    exit: { opacity: 0, y: context.still ? 0 : -3 },
    chart: context.still ? { duration: 0 } : sceneTiming.chart,
    connection: context.still ? { duration: 0 } : sceneTiming.connection,
    gestures: (disabled = false): MotionProps => ({
      animate: { y: 0, scale: 1 },
      whileHover: context.hover && !disabled ? { y: -2 } : undefined,
      whileTap:
        !context.still && !disabled ? { y: 0, scale: 0.985 } : undefined,
      transition: {
        ...(context.still ? { duration: 0 } : sceneTiming.gesture),
        layout: context.still ? { duration: 0 } : sceneTiming.layout,
      },
    }),
  };
}

/** Exit copies are never interactive or exposed to accessibility navigation. */
export const PresenceBlock = forwardRef<HTMLDivElement, HTMLMotionProps<"div">>(
  function PresenceBlock(props, ref) {
    const present = useIsPresent();
    return (
      <m.div
        {...props}
        ref={ref}
        inert={!present || undefined}
        aria-hidden={!present || undefined}
        data-exiting={!present || undefined}
      />
    );
  },
);
export { AnimatePresence, m };

/** New content enters; outgoing challenge content is removed immediately, including restricted feedback. */
export function SceneTransition({
  identity,
  children,
}: {
  identity: string;
  children: ReactNode;
}) {
  const motion = useSceneMotion();
  const previous = useRef(identity);
  const changed = previous.current !== identity;
  useEffect(() => {
    previous.current = identity;
  }, [identity]);
  return (
    <m.div
      data-scene-layout
      layout={motion.layout}
      className="scene-transition"
      style={{ borderRadius: 0 }}
    >
      <m.div
        key={identity}
        className="scene-challenge-body"
        data-scene-layout
        layout={motion.position}
        initial={changed && !motion.still ? { opacity: 0, y: 6 } : false}
        animate={rest}
        transition={motion.still ? { duration: 0 } : sceneTiming.challenge}
      >
        {children}
      </m.div>
    </m.div>
  );
}

/** Enter only when the provider was already mounted; no outgoing restricted content. */
export const SceneFeedback = forwardRef<
  HTMLElement,
  HTMLMotionProps<"section">
>(function SceneFeedback(props, ref) {
  const motion = useSceneMotion();
  return (
    <m.section
      {...props}
      ref={ref}
      data-scene-layout
      layout={motion.position}
      initial={motion.enter}
      animate={{ opacity: 1, y: 0 }}
      transition={motion.copy}
    />
  );
});

export function SceneAction({
  reduced,
  ...props
}: HTMLMotionProps<"button"> & { reduced: boolean }) {
  return (
    <SceneMotion reduced={reduced}>
      <ActionContent {...props} />
    </SceneMotion>
  );
}
function ActionContent({
  disabled,
  className,
  ...props
}: HTMLMotionProps<"button">) {
  const motion = useSceneMotion();
  return (
    <m.button
      {...props}
      disabled={disabled}
      className={`${className ?? ""} scene-motion-action`}
      data-scene-motion-control
      style={{ borderRadius: 17 }}
      {...motion.gestures(disabled)}
    />
  );
}

// The installed Motion hook snapshots the preference at mount. Subscribe directly
// so a device-setting change also settles existing scenes during the same session.
function useMediaPreference(query: string) {
  const [matches, setMatches] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const media = window.matchMedia(query);
    const update = () => setMatches(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [query]);
  return matches;
}

export function SceneFollowing({ children }: { children: ReactNode }) {
  const motion = useSceneMotion();
  return (
    <m.div data-scene-layout layout={motion.position}>
      {children}
    </m.div>
  );
}
