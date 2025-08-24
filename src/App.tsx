import React, { useRef, useState, useCallback } from "react";
import Gallery from "@/components/Gallery";
import Timeline from "@/components/Timeline";
import { mockImages } from "@/data/mockImages";

type MonthYear = { year: string; month: string };

export default function App() {
  const galleryRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentYear, setCurrentYear] = useState("2025"); // initial year
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);


  const handleScroll = useCallback(() => {
    const container = galleryRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const maxScrollTop = scrollHeight - clientHeight;

    if (maxScrollTop > 0) {
      setScrollProgress(scrollTop / maxScrollTop);
    } else {
      setScrollProgress(0);
    }

    setShowTooltip(true);
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    tooltipTimer.current = setTimeout(() => setShowTooltip(false), 1000);

    // topmost visible month year
    const monthSections = container.querySelectorAll<HTMLDivElement>(
      "[data-year][data-month]"
    );

    let visibleSection: MonthYear | null = null;
    monthSections.forEach((section) => {
      const sectionTop = section.offsetTop - scrollTop;
      if (sectionTop <= 20) {
        visibleSection = {
          year: section.getAttribute("data-year") ?? "",
          month: section.getAttribute("data-month") ?? "",
        };
      }
    });

    if (visibleSection) {
      const { year, month } = visibleSection;
      const monthName = new Date(
        Number(year),
        Number(month) - 1
      ).toLocaleString("default", { month: "long" });

      setCurrentYear(`${monthName} ${year}`);
    }

    // console.log({ scrollTop, scrollHeight, clientHeight, maxScrollTop });
  }, []);

  React.useEffect(() => {
    return () => {
      if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <Gallery ref={galleryRef} images={mockImages} onScroll={handleScroll} />
      <div className="fixed right-4 top-0 bottom-0 z-20">
        <Timeline
          scrollProgress={scrollProgress}
          currentYear={currentYear}
          showTooltip={showTooltip}
          onDragScroll={(p) => {
            if (galleryRef.current) {
              const { scrollHeight, clientHeight } = galleryRef.current;
              galleryRef.current.scrollTop = p * (scrollHeight - clientHeight);
            }
          }}
        />
      </div>
    </div>
  );
}