// src/App.tsx
import { mockApiResponse } from "./data/mockApiResponse";
import { groupByYear } from "./utils/groupByYear";
import { Timeline } from "./components/Timeline";

function App() {
  const yearCounts = groupByYear(mockApiResponse.images);

  return (
    <div className="flex">
      {/* Gallery placeholder (will build later) */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold">Demo Timeline App</h1>
        <p className="mt-4">This is where the gallery will go…</p>
      </div>

      {/* Timeline Scrollbar */}
      <Timeline yearCounts={yearCounts} />
    </div>
  );
}

export default App;
