import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Navbar from "./Navbar";
import OutlineButton from "./OutlineButton";
import butterflyPurple from "../assets/butterfly-purple.png";

// Scroll distance per section, in viewport heights. The sticky viewport
// stays pinned while the driver div underneath scrolls through this range,
// which is what lets us map [0,1] scroll progress onto crossfades instead
// of the sections just stacking and passing by.
const VH_PER_SECTION = 100;
const SECTION_COUNT = 3;

// Piecewise-linear remap with clamping at the ends, evaluated fresh on every
// call. Used via useTransform's callback form instead of its array form —
// see note below on why.
function remap(value, inputRange, outputRange) {
  if (value <= inputRange[0]) return outputRange[0];
  const last = inputRange.length - 1;
  if (value >= inputRange[last]) return outputRange[last];
  for (let i = 0; i < last; i++) {
    const a = inputRange[i];
    const b = inputRange[i + 1];
    if (value >= a && value <= b) {
      const t = b === a ? 0 : (value - a) / (b - a);
      return outputRange[i] + t * (outputRange[i + 1] - outputRange[i]);
    }
  }
  return outputRange[last];
}

export default function Scene() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // NOTE: useTransform's array-input form ([in], [out]) was producing
  // incorrect, non-clamped values for some of these ranges when checked
  // against actual scroll position (verified via computed styles) — values
  // outside the intended range leaked through instead of clamping at the
  // ends. The callback form with an explicit remap() sidesteps it entirely
  // and is easy to verify by inspection.

  // --- Video crossfades ---------------------------------------------------
  // Each pair of videos overlaps for a short scroll range so one fades out
  // as the next fades in, instead of a hard cut.
  const heroVideoOpacity = useTransform(scrollYProgress, (v) => remap(v, [0, 0.27, 0.36], [1, 1, 0]));
  const clubVideoOpacity = useTransform(scrollYProgress, (v) => remap(v, [0.27, 0.36, 0.64, 0.73], [0, 1, 1, 0]));
  const rooftopVideoOpacity = useTransform(scrollYProgress, (v) => remap(v, [0.64, 0.73, 1], [0, 1, 1]));

  // --- Text, animating on its own timing/motion from the videos ----------
  // Text fades/moves over a narrower window than the video crossfade so it
  // reads as its own layer rather than being locked to the background.
  const heroTextOpacity = useTransform(scrollYProgress, (v) => remap(v, [0, 0.2, 0.3], [1, 1, 0]));
  const heroTextY = useTransform(scrollYProgress, (v) => remap(v, [0, 0.3], [0, -50]));

  const clubTextOpacity = useTransform(scrollYProgress, (v) => remap(v, [0.3, 0.4, 0.6, 0.7], [0, 1, 1, 0]));
  const clubTextY = useTransform(scrollYProgress, (v) => remap(v, [0.3, 0.4, 0.6, 0.7], [50, 0, 0, -50]));

  const rooftopTextOpacity = useTransform(scrollYProgress, (v) => remap(v, [0.7, 0.8, 1], [0, 1, 1]));
  const rooftopTextY = useTransform(scrollYProgress, (v) => remap(v, [0.7, 0.8, 1], [50, 0, 0]));

  // Only let the active section's content receive clicks — the three text
  // layers are stacked on top of each other the whole time.
  const heroPointerEvents = useTransform(scrollYProgress, (v) => (v < 0.3 ? "auto" : "none"));
  const clubPointerEvents = useTransform(scrollYProgress, (v) => (v >= 0.3 && v < 0.7 ? "auto" : "none"));
  const rooftopPointerEvents = useTransform(scrollYProgress, (v) => (v >= 0.7 ? "auto" : "none"));

  // --- Butterflies, flying diagonally across their section's scroll range
  // Butterfly 2 has three beats: fly in from the bottom-left corner, hold
  // still at a resting spot (where a separate CSS animation makes it hover
  // up and down), then fly out toward the top-right corner.
  const butterfly2Opacity = useTransform(scrollYProgress, (v) => remap(v, [0.3, 0.38, 0.68, 0.74], [0, 1, 1, 0]));
  const butterfly2X = useTransform(scrollYProgress, (v) => `${remap(v, [0.3, 0.42, 0.6, 0.72], [-15, 15, 15, 110])}vw`);
  const butterfly2Y = useTransform(scrollYProgress, (v) => `${remap(v, [0.3, 0.42, 0.6, 0.72], [110, 55, 55, -20])}vh`);

  // Butterfly 3 mirrors that same fly-in / hold-and-hover / fly-out beat,
  // but travels the opposite diagonal: in from the top-right corner, out
  // toward the bottom-left.
  const butterfly3Opacity = useTransform(scrollYProgress, (v) => remap(v, [0.7, 0.77, 0.95, 1], [0, 1, 1, 0]));
  const butterfly3X = useTransform(scrollYProgress, (v) => `${remap(v, [0.7, 0.82, 0.92, 1], [110, 80, 80, -20])}vw`);
  const butterfly3Y = useTransform(scrollYProgress, (v) => `${remap(v, [0.7, 0.82, 0.92, 1], [-20, 45, 45, 110])}vh`);

  return (
    <div
      ref={containerRef}
      className="relative bg-black"
      style={{ height: `${VH_PER_SECTION * SECTION_COUNT}vh` }}
    >
      <div id="top" className="absolute top-0" />
      <div id="experiences" className="absolute" style={{ top: `${VH_PER_SECTION}vh` }} />
      <div id="rooftop" className="absolute" style={{ top: `${VH_PER_SECTION * 2}vh` }} />

      <div className="sticky top-0 h-screen min-h-[640px] w-full overflow-hidden">
        <motion.div className="absolute inset-0 h-full w-full" style={{ opacity: heroVideoOpacity }}>
          <video
            className="h-full w-full object-cover"
            src="/media/hero-video.mp4"
            poster="/media/hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
          />
        </motion.div>
        <motion.div className="absolute inset-0 h-full w-full" style={{ opacity: clubVideoOpacity }}>
          <video
            className="h-full w-full object-cover"
            src="/media/club-video.mp4"
            poster="/media/club-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
          />
        </motion.div>
        <motion.div className="absolute inset-0 h-full w-full" style={{ opacity: rooftopVideoOpacity }}>
          <video
            className="h-full w-full object-cover"
            src="/media/rooftop-video.webm"
            poster="/media/rooftop-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/30" />

        <Navbar />

        <motion.div
          className="pointer-events-none absolute top-0 left-0"
          style={{ opacity: butterfly2Opacity, x: butterfly2X, y: butterfly2Y, scaleX: -1, scaleY: -1 }}
        >
          <div className="animate-[hover-bob_2.6s_ease-in-out_infinite]">
            <img
              src={butterflyPurple}
              alt=""
              aria-hidden="true"
              className="w-[576px] select-none drop-shadow-[0_0_25px_rgba(0,0,0,0.5)] md:w-[768px]"
            />
          </div>
        </motion.div>
        <motion.div
          className="pointer-events-none absolute top-0 left-0"
          style={{ opacity: butterfly3Opacity, x: butterfly3X, y: butterfly3Y, scaleX: -1, scaleY: -1 }}
        >
          <div className="animate-[hover-bob_2.6s_ease-in-out_infinite]">
            <img
              src={butterflyPurple}
              alt=""
              aria-hidden="true"
              className="w-[576px] select-none drop-shadow-[0_0_25px_rgba(0,0,0,0.5)] md:w-[768px]"
            />
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 z-20 flex items-end justify-center pb-16 md:pb-24"
          style={{ opacity: heroTextOpacity, y: heroTextY, pointerEvents: heroPointerEvents }}
        >
          <OutlineButton href="#experiences">Ready to Explore?</OutlineButton>
        </motion.div>

        <motion.div
          className="absolute inset-0 z-20 flex items-center"
          style={{ opacity: clubTextOpacity, y: clubTextY, pointerEvents: clubPointerEvents }}
        >
          <div className="ml-auto mr-6 w-full max-w-xl border border-white/25 px-8 py-14 sm:mr-[8%] sm:px-12 md:mr-[10%]">
            <h2 className="font-display text-3xl font-light text-white sm:text-4xl md:text-5xl">
              Catch Feelings. Not Just Deals.
            </h2>
            <p className="mt-3 font-body text-sm text-white/90 md:mt-4 md:text-lg">
              Experiences you'll remember long after the shopping bags are gone.
            </p>
            <OutlineButton href="#rooftop" className="mt-8 md:mt-10">
              Let's Play
            </OutlineButton>
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-0 z-20 flex items-center"
          style={{ opacity: rooftopTextOpacity, y: rooftopTextY, pointerEvents: rooftopPointerEvents }}
        >
          <div className="mx-6 w-full max-w-xl border border-white/25 px-8 py-14 sm:mx-[8%] sm:px-12 md:mx-[10%]">
            <h2 className="font-display text-3xl font-light text-white sm:text-4xl md:text-5xl">
              The View Everyone's Talking About.
            </h2>
            <p className="mt-3 font-body text-sm text-white/90 md:mt-4 md:text-lg">
              Sip, relax and take in Prague from above.
            </p>
            <OutlineButton className="mt-8 md:mt-10">Elevate Your Day</OutlineButton>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
