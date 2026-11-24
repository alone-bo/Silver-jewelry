import { useEffect, useRef, useState } from "react";
import { cx } from "../lib/format";

/**
 * Cover-first, muted, looping background film with no controls.
 * The poster stays visible until playback genuinely begins, then crossfades.
 */
export function LoopVideo({
  src,
  poster,
  label,
  className,
  position = "center 40%",
}: {
  src: string;
  poster: string;
  label: string;
  className?: string;
  position?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    video.play().catch(() => {});
  }, []);

  return (
    <div className={cx("relative overflow-hidden bg-stone", className)}>
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-label={label}
        style={{ objectPosition: position }}
        className={cx(
          "h-full w-full object-cover transition-opacity duration-700",
          started ? "opacity-100" : "opacity-0",
        )}
        onPlaying={() => setStarted(true)}
      />
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        style={{ objectPosition: position }}
        className={cx(
          "pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
          started ? "opacity-0" : "opacity-100",
        )}
      />
    </div>
  );
}
