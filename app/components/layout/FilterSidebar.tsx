"use client";

import {
  useQueryState,
  parseAsArrayOf,
  parseAsString,
  parseAsInteger,
} from "nuqs";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  // We accept the counts as a prop now
  counts: {
    type: Record<string, number>;
    capacity: Record<string, number>;
  };
}

export default function FilterSidebar({
  isOpen,
  onClose,
  counts,
}: FilterSidebarProps) {
  // Bind filters to URL query parameters
  const [types, setTypes] = useQueryState(
    "category",
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ shallow: false }),
  );
  const [capacities, setCapacities] = useQueryState(
    "people",
    parseAsArrayOf(parseAsString)
      .withDefault([])
      .withOptions({ shallow: false }),
  );
  const [maxPrice, setMaxPrice] = useQueryState(
    "price",
    parseAsInteger.withDefault(100).withOptions({ shallow: false }),
  );
  console.log("Current Filters:", counts.type, counts.capacity, maxPrice);
  // Helper to toggle checkbox values in URL
  const toggleFilter = (
    current: string[],
    value: string,
    setter: (val: string[] | null) => void,
  ) => {
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setter(next.length > 0 ? next : null);
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-full bg-white z-50 overflow-y-auto transition-all duration-300 lg:relative lg:h-auto ${
        isOpen ? "translate-x-0 w-fit p-8" : "-translate-x-full w-0 p-0 md:w-0"
      }`}
    >
      <div className="w-60 lg:w-52.5">
        {/* Type Section */}
        <div className="mb-10">
          <h3 className="text-[#90A3BF] text-xs font-bold uppercase tracking-wider mb-6">
            Type
          </h3>
          <div className="flex flex-col gap-6">
            {Object.entries(counts.type).map(([label, count]) => (
              <label
                key={label}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={types.includes(label)}
                  onChange={() => toggleFilter(types, label, setTypes)}
                  className="w-5 h-5 rounded border-gray-300 accent-[#3563E9]"
                />
                <span className="font-semibold text-secondary-400">
                  {label} <span className="text-[#90A3BF]">({count})</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Capacity Section */}
        <div className="mb-10">
          <h3 className="text-[#90A3BF] text-xs font-bold uppercase tracking-wider mb-6">
            Capacity
          </h3>
          <div className="flex flex-col gap-6">
            {Object.entries(counts.capacity).map(([label, count]) => (
              <label
                key={label}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={capacities.includes(label)}
                  onChange={() =>
                    toggleFilter(capacities, label, setCapacities)
                  }
                />
                <span className="font-semibold text-secondary-400">
                  {label} Person{" "}
                  <span className="text-[#90A3BF]">({count})</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Section */}
        <div className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[#90A3BF] text-xs font-bold uppercase tracking-wider">
              Price
            </h3>
            <span className="text-secondary-400 font-semibold text-sm tabular-nums">
              ${maxPrice}.00
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-2 bg-[#3563E9] rounded-lg appearance-none cursor-pointer accent-[#3563E9]"
          />
        </div>
      </div>
    </aside>
  );
}
