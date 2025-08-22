import { mockImages } from "../data/mockImages";

export type Image = {
  id: string;
  date_created: string; // ISO date string (eg: "2024-03-15")
};

export function groupImagesByYear(images: Image[]): Record<number, Image[]> {
  const groups: Record<number, Image[]> = {};

  images.forEach((img) => {
    const year = new Date(img.date_created).getFullYear();
    if (!groups[year]) groups[year] = [];
    groups[year].push(img);
  });

  // Sort by year in descending order
  const sorted = Object.fromEntries(
    Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a))
  );

  return sorted;
}

export function getYearCounts(groups: Record<number, Image[]>): Record<number, number> {
  return Object.fromEntries(
    Object.entries(groups).map(([year, imgs]) => [Number(year), imgs.length])
  );
}

// Run grouping and counts
const grouped = groupImagesByYear(mockImages);
const yearCounts = getYearCounts(grouped);

console.log("Grouped Images:", grouped);
console.log("Year Counts:", yearCounts);
