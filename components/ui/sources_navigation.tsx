import React from "react";
import { cn } from "@/lib/utils";

interface SourcesNavigationProps {
  activeTab: number;
  onTabChange: (tab: number) => void;
  items: string[];
}

export function SourcesNavigation({
  activeTab,
  onTabChange,
  items,
}: SourcesNavigationProps) {
  return (
    <nav className="w-full sm:w-64 sm:flex-shrink-0 bg-gray-100 sm:h-full overflow-auto">
      <ul className="flex flex-row sm:flex-col">
        {items.map((item, index) => (
          <li key={index} className="flex-shrink-0 sm:flex-shrink">
            <button
              onClick={() => onTabChange(index)}
              className={cn(
                "w-full px-4 py-2 text-left hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-nowrap",
                activeTab === index && "bg-gray-200 font-semibold"
              )}
            >
              {item}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
