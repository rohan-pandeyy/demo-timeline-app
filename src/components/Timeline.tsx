import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";

interface Marker {
  progress: number;
  label: string;
}

interface TimelineProps {
  scrollProgress: number;
  currentYear: string;
  showTooltip: boolean;
  markers?: Marker[];
  onDragScroll: (progress: number) => void;
  onHoverScroll?: (progress: number) => string;
}

export default function Timeline({
  scrollProgress,
  currentYear,
  showTooltip,
  markers = [],
  onDragScroll,
  onHoverScroll,
}: TimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoverProgress, setHoverProgress] = useState<number | null>(null);
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);
  const [isThumbHovered, setIsThumbHovered] = useState(false);
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);
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

  function getProgressFromEvent(e: React.MouseEvent) {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const offset = e.clientY - rect.top;
    return Math.min(Math.max(offset / rect.height, 0), 1);
  }

  const suppressHover = isThumbHovered || isDraggingThumb;

  return (
    <div
      ref={containerRef}
      className="relative h-full w-10 flex items-start justify-center"
      onMouseMove={(e) => {
        if (suppressHover) return; // skip hover updates
        const p = getProgressFromEvent(e);
        setHoverProgress(p);
        if (onHoverScroll) setHoverLabel(onHoverScroll(p));
      }}
      onMouseLeave={() => {
        setHoverProgress(null);
        setHoverLabel(null);
      }}
      onClick={(e) => {
        const p = getProgressFromEvent(e);
        onDragScroll(p);
      }}
    >
      {/* Timeline line */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1 bg-gray-200 rounded" />

      {/* Month markers */}
      {markers.map((m, idx) => (
        <div
          key={idx}
          className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-gray-500 shadow-sm"
          style={{ top: `${m.progress * 100}%` }}
          title={m.label}
        />
      ))}

      {/* Hover tooltip (hidden if thumb hovered or dragging) */}
      {!suppressHover && hoverProgress !== null && hoverLabel && (
        <div
          className="absolute right-full mr-2 px-2 py-1 rounded bg-black text-white text-xs whitespace-nowrap pointer-events-none"
          style={{ top: `${hoverProgress * 100}%`, transform: "translateY(-50%)" }}
        >
          {hoverLabel}
        </div>
      )}

      {/* Draggable thumb */}
      <motion.div
        drag="y"
        dragConstraints={containerRef}
        onDrag={handleDrag}
        onDragStart={() => setIsDraggingThumb(true)}
        onDragEnd={() => setIsDraggingThumb(false)}
        onMouseEnter={() => setIsThumbHovered(true)}
        onMouseLeave={() => setIsThumbHovered(false)}
        style={{
          y,
          position: "absolute",
          left: "50%",
          translateX: "-50%",
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
