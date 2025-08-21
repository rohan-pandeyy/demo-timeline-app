// src/App.tsx
import { useState, useEffect, useRef } from "react";
import { mockApiResponse } from "./data/mockApiResponse";
import { groupByYear } from "./utils/groupByYear";
import { Timeline } from "./components/Timeline";
import { Gallery } from "./components/Gallery";

function App() {
  const yearCounts = groupByYear(mockApiResponse.images);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const galleryRef = useRef<HTMLDivElement | null>(null);

  // Scrollbar → Gallery
  const handleYearSelect = (year: number) => {
    const section = document.getElementById(`year-${year}`);
    section?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Gallery → Scrollbar (observe sections in view)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the section most in view
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0) {
          const year = Number(visible[0].target.getAttribute("data-year"));
          setSelectedYear(year);
        }
      },
      { root: galleryRef.current, threshold: 0.6 }
    );

    // Observe each year section
    const sections = document.querySelectorAll("[data-year]");
    sections.forEach((s) => observer.observe(s));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex">
      {/* Gallery (scrollable container) */}
      <Gallery ref={galleryRef} images={mockApiResponse.images} />

      {/* Timeline with sync */}
      <Timeline
        yearCounts={yearCounts}
        selectedYear={selectedYear}
        onYearSelect={handleYearSelect}
      />
    </div>
  );
}

export default App;
