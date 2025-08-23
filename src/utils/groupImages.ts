import { mockImages } from "../data/mockImages";

export type Image = {
  id: string;
  date_created: string; // ISO based date string ie: "2024-03-15"
};

export function groupImagesByYearMonth(
  images: Image[]
): Record<number, Record<number, Image[]>> {
  return images.reduce((acc, img) => {
    const date = new Date(img.date_created);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 0 means jan

    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];

    acc[year][month].push(img);
    return acc;
  }, {} as Record<number, Record<number, Image[]>>);
}


export function getYearCounts(
  groups: Record<number, Record<number, Image[]>>
): Record<number, number> {
  return Object.fromEntries(
    Object.entries(groups).map(([year, months]) => {
      const total = Object.values(months).reduce(
        (count, imgs) => count + imgs.length,
        0
      );
      return [Number(year), total];
    })
  );
}

const grouped = groupImagesByYearMonth(mockImages);
const yearCounts = getYearCounts(grouped);

console.log("Grouped Images:", grouped);
console.log("Year Counts:", yearCounts);
