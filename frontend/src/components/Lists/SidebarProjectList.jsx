import { useEffect, useRef } from "react";
import { ArrowRight, CirclePlus } from "lucide-react";
import { useInfiniteProjects } from "../../api/queries/project.query";

const SidebarProjectsList = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProjects();

  const containerRef = useRef(null);
  const observerRef = useRef(null); // 🔥 persist observer
  const fetchingRef = useRef(false); // 🔥 prevent duplicate calls

  const projects = data?.pages.flatMap((page) => page.data) || [];

  useEffect(() => {
    const trigger = document.getElementById("load-more-trigger");

    if (!trigger || !hasNextPage) return;

    // 🔥 create once
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];

          if (
            entry.isIntersecting &&
            hasNextPage &&
            !isFetchingNextPage &&
            !fetchingRef.current
          ) {
            fetchingRef.current = true;
            fetchNextPage().finally(() => {
              fetchingRef.current = false;
            });
          }
        },
        {
          root: containerRef.current,
          threshold: 0, // 🔥 trigger earlier
          rootMargin: "100px", // 🔥 prefetch before bottom
        },
      );
    }

    const observer = observerRef.current;
    observer.observe(trigger);

    return () => {
      observer.unobserve(trigger);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <div className="space-y-2 py-2 h-96">
      {/* Header */}
      <div className="flex items-center justify-between text-gray-400">
        <p className="text-xs">Projects</p>
        <CirclePlus size={16} />
      </div>

      {/* Scroll container */}
      <div
        ref={containerRef}
        className="max-h-80 overflow-y-auto space-y-2 py-2"
      >
        {projects.length > 0 ? (
          projects.map((project, index) => (
            <p key={project._id} className="truncate">
              {index + 1}. {project.name}
            </p>
          ))
        ) : (
          <div className="px-2">
            <p className="text-gray-400 text-xs">
              There is no project in this Workspace yet. Project you create will
              show up here.
            </p>
            <div className="flex items-center gap-1">
              <p className="font-bold text-xs underline underline-offset-4">
                {" "}
                Create a project
              </p>
              <ArrowRight size={16} />
            </div>
          </div>
        )}

        {/* 🔥 trigger */}
        <div id="load-more-trigger" className="h-1" />

        {/* 🔥 smooth loader */}
        {isFetchingNextPage && (
          <div className="py-2 space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-3 bg-gray-200 rounded animate-pulse" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarProjectsList;
