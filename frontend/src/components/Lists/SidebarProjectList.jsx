import { useState } from "react";
import { CirclePlus, Ellipsis } from "lucide-react";

const projectsData = [
  "Automation Quality Inspection System",
  "Frontend Component Library",
  "Frontend Testing",
  "Analytics Optimization",
  "File Storage and Management System",
  "Automation Quality Inspection System",
  "Frontend Component Library",
  "Frontend Testing",
  "Analytics Optimization",
  "File Storage and Management System",
  "Automation Quality Inspection System",
  "Frontend Component Library",
  "Frontend Testing",
  "Analytics Optimization",
  "File Storage and Management System",
  "Automation Quality Inspection System",
  "Frontend Component Library",
  "Frontend Testing",
  "Analytics Optimization",
  "File Storage and Management System",
];

const SidebarProjectsList = () => {
  const [visibleCount, setVisibleCount] = useState(5);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 5);
  };

  return (
    <div className="space-y-2 py-2 h-96">
      <div className="flex items-center justify-between text-gray-400">
        <p className="text-xs">Projects</p>
        <CirclePlus size={16} />
      </div>

      <div className="overflow-y-scroll scrollbar-hide max-h-80 space-y-2 py-2">
        {projectsData.slice(0, visibleCount).map((project, index) => (
          <p key={index} className="truncate">
            {index + 1 + "."} {project}
          </p>
        ))}
      </div>

      {visibleCount < projectsData.length && (
        <div
          onClick={handleLoadMore}
          className="flex items-center gap-1 cursor-pointer"
        >
          <Ellipsis size={12} />
          <p className="text-gray-400">More</p>
        </div>
      )}
    </div>
  );
};

export default SidebarProjectsList;
