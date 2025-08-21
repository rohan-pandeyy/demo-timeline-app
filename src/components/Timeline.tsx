// src/components/Timeline.tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

type TimelineProps = {
  yearCounts: Record<number, number>;
  selectedYear: number | null;
  onYearSelect?: (year: number) => void;
};

export function Timeline({ yearCounts, selectedYear, onYearSelect }: TimelineProps) {
  const total = Object.values(yearCounts).reduce((a, b) => a + b, 0);

  return (
    <TooltipProvider>
      <div className="fixed right-0 top-0 h-screen w-12 flex flex-col border-l border-gray-300">
        {Object.entries(yearCounts).map(([year, count]) => {
          const proportion = (count / total) * 100;

          return (
            <Tooltip key={year}>
              <TooltipTrigger asChild>
                <div
                  onClick={() => onYearSelect?.(Number(year))}
                  className={`cursor-pointer w-full transition-colors
                    ${selectedYear === Number(year) ? "bg-blue-500" : "bg-gray-400 hover:bg-gray-500"}
                  `}
                  style={{ height: `${proportion}%` }}
                />
              </TooltipTrigger>
              <TooltipContent side="left">
                <p>
                  {year} – {count} images
                </p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
