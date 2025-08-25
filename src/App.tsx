import React, { useRef, useState, useCallback } from "react";
import Gallery from "@/components/Gallery";
import Timeline from "@/components/Timeline";
import { mockImages } from "@/data/mockImages";

type MonthYear = { year: string; month: string };
type Marker = { progress: number; label: string };

export default function App() {
  const galleryRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentYear, setCurrentYear] = useState("2025");
  const [showTooltip, setShowTooltip] = useState(false);
  const [markers, setMarkers] = useState<Marker[]>([]);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const calculateMarkers = useCallback(() => {
    const container = galleryRef.current;
    if (!container) return [];

    const { scrollHeight, clientHeight } = container;
    const maxScrollTop = scrollHeight - clientHeight;

    const monthSections = container.querySelectorAll<HTMLDivElement>(
      "[data-year][data-month]"
    );

    const newMarkers: Marker[] = [];
    monthSections.forEach((section) => {
      const year = section.getAttribute("data-year") ?? "";
      const month = section.getAttribute("data-month") ?? "";
      const monthName = new Date(Number(year), Number(month) - 1).toLocaleString(
        "default",
        { month: "long" }
      );
      const label = `${monthName} ${year}`;
      const progress = section.offsetTop / maxScrollTop; // normalized position
      newMarkers.push({ progress, label });
    });

    return newMarkers;
  }, []);

  const handleScroll = useCallback(() => {
    const container = galleryRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const maxScrollTop = scrollHeight - clientHeight;

    setScrollProgress(maxScrollTop > 0 ? scrollTop / maxScrollTop : 0);

    setShowTooltip(true);
    if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    tooltipTimer.current = setTimeout(() => setShowTooltip(false), 1000);

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
    
    setMarkers(calculateMarkers());
  }, [calculateMarkers]);

  const getLabelFromProgress = (progress: number): string => {
    const container = galleryRef.current;
    if (!container) return "";
    const { scrollHeight, clientHeight } = container;
    const targetScroll = progress * (scrollHeight - clientHeight);

    const monthSections = container.querySelectorAll<HTMLDivElement>(
      "[data-year][data-month]"
    );
    let label = "";
    monthSections.forEach((section) => {
      if (section.offsetTop <= targetScroll + 20) {
        const year = section.getAttribute("data-year") ?? "";
        const month = section.getAttribute("data-month") ?? "";
        const monthName = new Date(
          Number(year),
          Number(month) - 1
        ).toLocaleString("default", { month: "long" });
        label = `${monthName} ${year}`;
      }
    });

    return label;
  };

  React.useEffect(() => {
    setMarkers(calculateMarkers());

    return () => {
      if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
    };
  }, [calculateMarkers]);

  return (
    <div className="flex h-screen overflow-hidden">
      <Gallery ref={galleryRef} images={mockImages} onScroll={handleScroll} />
      <div className="fixed right-4 top-0 bottom-0 z-20">
        <Timeline
          scrollProgress={scrollProgress}
          currentYear={currentYear}
          showTooltip={showTooltip}
          markers={markers}
          onDragScroll={(p) => {
            if (galleryRef.current) {
              const { scrollHeight, clientHeight } = galleryRef.current;
              galleryRef.current.scrollTop = p * (scrollHeight - clientHeight);
            }
          }}
          onHoverScroll={getLabelFromProgress}
        />
      </div>
    </div>
  );
}
