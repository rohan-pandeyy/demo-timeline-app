import React, { useRef, useState, useCallback } from "react";
import Gallery from "@/components/Gallery";
import { mockImages } from "@/data/mockImages";

export default function App() {
  const galleryRef = useRef<HTMLDivElement>(null);
  
  // needed to track the scroll progress for the scrollbar
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentYear, setCurrentYear] = useState("2025"); // 2025 is  initial year

  const handleScroll = useCallback(() => {
    if (!galleryRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = galleryRef.current;
    const maxScrollTop = scrollHeight - clientHeight;

    if (maxScrollTop > 0) {
      const progress = scrollTop / maxScrollTop;
      setScrollProgress(progress);
      // Logic to update currentYear here
    }
  }, []);

  return (
    <div className="flex">
      <Gallery 
        ref={galleryRef} 
        images={mockImages} 
        onScroll={handleScroll} 
      />
      {/* scrollbar component here */}
    </div>
  );
}