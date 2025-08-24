import React, { forwardRef } from "react";
import { groupImagesByYearMonth, getYearCounts } from "../utils/groupImages";
import type { Image } from "../utils/groupImages";

type GalleryProps = {
  images: Image[];
  onScroll: (event: React.UIEvent<HTMLDivElement>) => void;
  className?: string;
};

const Gallery = forwardRef<HTMLDivElement, GalleryProps>(({ images, onScroll, className }, ref) => {
  // Group images by year -> month -> images[]
  const grouped = groupImagesByYearMonth(images);
  const yearCounts = getYearCounts(grouped);

  return (
    <div
      ref={ref}
      onScroll={onScroll}
      className={`overflow-y-auto flex-1  h-screen w-screen bg-gray-50 ${className ?? ""}`}
    >
      <div className="max-w-7xl mx-auto px-6 py-8">
        {Object.entries(grouped)
          .sort((a, b) => Number(b[0]) - Number(a[0])) // Sort years descending
          .map(([year, months]) => (
            <div key={year} data-year={year} className="mb-8">
              <h2 className="text-2xl font-bold mb-4 py-2">
                {year} ({yearCounts[Number(year)]})
              </h2>

              {Object.entries(months)
                .sort((a, b) => Number(b[0]) - Number(a[0])) // Sort months descending
                .map(([month, imgs]) => (
                  <div key={`${year}-${month}`} data-year={year} data-month={month} className="mb-6">
                    <h3 className="text-xl font-semibold mb-2 sticky top-0 bg-gray-50/80 backdrop-blur-sm py-2 z-10">
                      {`${new Date(Number(year), Number(month) - 1).toLocaleString(
                        "default",
                        { month: "long" }
                      )} ${year}`}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {imgs.map((img) => (
                        <div
                          key={img.id}
                          className="border rounded-lg p-2 text-center bg-white shadow-sm flex flex-col justify-center items-center"
                        >
                          <p className="text-sm text-gray-500">
                            {img.date_created}
                          </p>
                          <span className="text-md font-medium">
                            ID: {img.id}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          ))}
      </div>
    </div>
  );
});

Gallery.displayName = "Gallery";

export default Gallery;
