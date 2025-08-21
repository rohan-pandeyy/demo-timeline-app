// src/components/Gallery.tsx
import { forwardRef } from "react";

type Image = {
  id: string;
  date_created: string;
};

type GalleryProps = {
  images: Image[];
};

export const Gallery = forwardRef<HTMLDivElement, GalleryProps>(
  ({ images }, ref) => {
    const groups: Record<number, Image[]> = {};

    images.forEach((img) => {
      const year = new Date(img.date_created).getFullYear();
      if (!groups[year]) groups[year] = [];
      groups[year].push(img);
    });

    const sortedYears = Object.keys(groups)
      .map((y) => Number(y))
      .sort((a, b) => b - a);

    return (
      <div
        ref={ref}
        className="flex-1 overflow-y-auto h-screen p-6 space-y-12 scroll-smooth"
      >
        {sortedYears.map((year) => (
          <div
            key={year}
            id={`year-${year}`}
            data-year={year} // 👈 used by IntersectionObserver
            className="space-y-4"
          >
            <h2 className="text-xl font-bold">{year}</h2>
            <div className="grid grid-cols-1 gap-2">
              {groups[year].map((img) => (
                <div
                  key={img.id}
                  className="bg-gray-200 w-80 h-32 rounded flex items-center justify-center text-sm text-gray-600"
                >
                  {img.id}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }
);
