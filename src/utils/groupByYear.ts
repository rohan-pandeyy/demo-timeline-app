type Image = {
  id: string;
  date_created: string;
};

export function groupByYear(images: Image[]): Record<number, number> {
  const yearCounts: Record<number, number> = {};

  images.forEach((img) => {
    const year = new Date(img.date_created).getFullYear();
    yearCounts[year] = (yearCounts[year] || 0) + 1;
  });

  return yearCounts;
}
