import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

interface TimelineProps {
  scrollProgress: number;
  currentYear: string;
  showTooltip: boolean;
  onDragScroll: (progress: number) => void;
}

export default function Timeline({
  scrollProgress,
  currentYear,
  showTooltip,
  onDragScroll,
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const y = useMotionValue(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.getBoundingClientRect().height);
      }
    };
    measure();

    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    if (containerHeight > 0) {
      y.set(scrollProgress * containerHeight);
    }
  }, [scrollProgress, containerHeight, y]);

  function handleDrag(
    _evt: MouseEvent | TouchEvent | PointerEvent,
    info: { point: { y: number } }
  ) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const offset = info.point.y - rect.top;
    const clamped = Math.min(Math.max(offset / rect.height, 0), 1);
    onDragScroll(clamped);
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-10 flex items-start justify-center"
    >
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gray-200 rounded" />

      <motion.div
        drag="y"
        dragConstraints={containerRef}
        onDrag={handleDrag}
        style={{
          y,
          position: "absolute",
          left: "50%",
          translateX: "-50%",
          translateY: "0%",
        }}
        className="group w-3 h-3 bg-blue-500 rounded-full shadow-lg cursor-grab"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 1.1, cursor: "grabbing" }}
      >
        <div
          className={[
            "absolute right-full mr-2 px-2 py-1 rounded bg-black text-white text-xs whitespace-nowrap",
            "transition-opacity duration-150 pointer-events-none",
            showTooltip ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          ].join(" ")}
        >
          {currentYear}
        </div>
      </motion.div>
    </div>
  );
}
