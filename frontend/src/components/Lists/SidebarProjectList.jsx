import { useEffect, useRef } from "react";
import {
  ArrowRight,
  CirclePlus,
  EllipsisVertical,
  Folder,
  FolderOpen,
  Trash2,
} from "lucide-react";
import { useInfiniteProjects } from "../../api/queries/project.query";
import CreateProjectForm from "../CreateProjectForm";
import { useModal } from "../../context/ModalContext";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import DeleteProjectModal from "../DeleteProjectModal";

const SidebarProjectsList = () => {
  const { openModal } = useModal();
  const navigate = useNavigate();

  const location = useLocation();

  const currentOpenProject = location.pathname.split("/")[2];

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProjects();

  const containerRef = useRef(null);
  const observerRef = useRef(null); // 🔥 persist observer
  const fetchingRef = useRef(false); // 🔥 prevent duplicate calls
  const menuRef = useRef();

  const [open, setOpen] = useState("");

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
          threshold: 0,
          rootMargin: "20px",
        },
      );
    }

    const observer = observerRef.current;
    observer.observe(trigger);

    return () => {
      observer.unobserve(trigger);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(""); // Reset to empty string
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="space-y-2 py-2 ">
      {/* Header */}
      <div className="flex items-center justify-between text-gray-400">
        <p className="text-xs">Projects</p>
        <CirclePlus
          className="cursor-pointer"
          size={16}
          onClick={() => openModal(<CreateProjectForm />)}
        />
      </div>

      {/* Scroll container */}
      <div ref={containerRef} className="max-h-80 overflow-y-auto py-2">
        {" "}
        {/* overflow-auto */}
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project._id}
              className={`flex items-center justify-between hover:bg-gray-100 ${currentOpenProject === project?._id ? "bg-gray-100" : ""} `}
            >
              <div
                onClick={() => navigate(`/project/${project?._id}`)}
                className={`w-[90%] rounded  `}
              >
                <p className="flex items-center gap-2 truncate rounded cursor-pointer p-2">
                  <span>
                    {project?._id === currentOpenProject ? (
                      <FolderOpen size={16} />
                    ) : (
                      <Folder size={16} />
                    )}
                  </span>
                  {project.name}
                </p>
              </div>

              <div
                className="relative"
                ref={open === project._id ? menuRef : null}
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen(open === project._id ? "" : project._id);
                  }}
                  className="rounded cursor-pointer hover:bg-gray-100 p-1 transition-colors"
                >
                  <EllipsisVertical size={12} />
                </button>

                {open === project._id && (
                  <div className="absolute right-0 top-full mt-1 bg-white shadow-lg w-40 border border-gray-200 rounded-md z-999">
                    <button
                      onClick={() => {
                        navigate(`/project/${project._id}`);
                        setOpen("");
                      }}
                      className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100"
                    >
                      <Folder size={14} />
                      View Project
                    </button>
                    <button
                      onClick={() =>
                        openModal(<DeleteProjectModal project={project} />)
                      }
                      className="flex items-center gap-2 w-full px-3 py-2 text-red-500 hover:bg-gray-100"
                    >
                      <Trash2 size={14} />
                      Delete Project
                    </button>
                  </div>
                )}
              </div>
            </div>
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
