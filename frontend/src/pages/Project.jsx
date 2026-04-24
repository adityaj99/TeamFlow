// import React from "react";
// import { useParams } from "react-router-dom";
// import CreateTaskForm from "../components/CreateTaskForm";
// import { useModal } from "../context/ModalContext";
// import { useStats } from "../api/queries/stats.query";
// import Cards from "../components/Cards";

// const Project = () => {
//   const { openModal } = useModal();

//   const params = useParams();

//   console.log("Project ID:", params.projectId);

//   const { data: stats, isLoading: statsLoading } = useStats({
//     scope: "project",
//     projectId: params.projectId,
//   });

//   console.log("Stats Data:", stats);

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-semibold">Project Name Here</h1>
//           <p className="text-gray-400 text-sm">Project description here</p>
//         </div>

//         <button
//           onClick={() => openModal(<CreateTaskForm />)}
//           className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 cursor-pointer transition"
//         >
//           + New Task
//         </button>
//       </div>

//       {/* Cards */}
//       <Cards stats={stats} isLoading={statsLoading} />

//       <div className="border-b border-gray-200" />

//         {/* tasks table here */}

//     </div>
//   );
// };

// export default Project;

// import { useState } from "react";
// import { useParams } from "react-router-dom";
// import { useTasks } from "../api/queries/task.query";
// import { useModal } from "../context/ModalContext";
// import CreateTaskForm from "../components/CreateTaskForm";
// import TaskRow from "../components/TaskRow";
// import Cards from "../components/Cards"; // 🔥 keep cards
// import { ChevronDown } from "lucide-react";

// const Project = () => {
//   const { projectId } = useParams();
//   const { openModal } = useModal();

//   const [filters, setFilters] = useState({
//     search: "",
//     status: "",
//     priority: "",
//     page: 1,
//     limit: 10,
//   });

//   const { data, isLoading, isFetching } = useTasks({
//     ...filters,
//     projectId,
//   });

//   const tasks = data?.data || [];
//   const totalPages = data?.pages || 1;

//   return (
//     <div className="space-y-6">
//       {/* 🔥 HEADER */}
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-semibold">Project Tasks</h1>
//           <p className="text-gray-400 text-sm">Manage tasks for this project</p>
//         </div>

//         <button
//           onClick={() => openModal(<CreateTaskForm projectId={projectId} />)}
//           className="bg-black text-white px-4 py-2 rounded-md"
//         >
//           + New Task
//         </button>
//       </div>

//       {/* 🔥 CARDS (KEEP THIS) */}
//       <Cards />

//       {/* 🔥 FILTERS */}
//       <div className="flex gap-3 flex-wrap">
//         <input
//           placeholder="Search tasks..."
//           className="border px-3 py-2 rounded-md w-64 text-sm"
//           value={filters.search}
//           onChange={(e) =>
//             setFilters({
//               ...filters,
//               search: e.target.value,
//               page: 1,
//             })
//           }
//         />

//         <div className="relative">
//           <select
//             className="h-9 w-36 border border-gray-200 rounded-md px-3 text-sm appearance-none bg-white"
//             onChange={(e) =>
//               setFilters({
//                 ...filters,
//                 status: e.target.value,
//                 page: 1,
//               })
//             }
//           >
//             <option value="">Status</option>
//             <option value="todo">Todo</option>
//             <option value="in_progress">In Progress</option>
//             <option value="submitted">Submitted</option>
//           </select>
//           <ChevronDown
//             className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
//             size={14}
//           />
//         </div>

//         <div className="relative">
//           <select
//             className="h-9 w-36 border border-gray-200 rounded-md px-3 text-sm appearance-none bg-white"
//             onChange={(e) =>
//               setFilters({
//                 ...filters,
//                 priority: e.target.value,
//                 page: 1,
//               })
//             }
//           >
//             <option value="">Priority</option>
//             <option value="low">Low</option>
//             <option value="medium">Medium</option>
//             <option value="high">High</option>
//           </select>
//           <ChevronDown
//             className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
//             size={14}
//           />
//         </div>
//       </div>

//       {/* 🔥 TABLE */}
//       <div className="border border-gray-200 rounded overflow-hidden">
//         <table className="table-fixed w-full text-sm">
//           <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
//             <tr>
//               <th className="px-4 py-3 text-left w-[19%]">Title</th>
//               <th className="px-4 py-3 text-left w-[19%]">Assigned</th>
//               <th className="px-4 py-3 text-left w-[19%]">Due</th>
//               <th className="px-4 py-3 text-left w-[19%]">Status</th>
//               <th className="px-4 py-3 text-left w-[19%]">Priority</th>
//               <th className="px-4 py-3 text-left w-[5%]"></th>
//             </tr>
//           </thead>

//           <tbody>
//             {isLoading ? (
//               [...Array(5)].map((_, i) => (
//                 <tr
//                   key={i}
//                   className="border-b border-gray-50 last:border-0 animate-pulse"
//                 >
//                   <td className="px-4 py-3">
//                     <div className="w-32 h-4 bg-gray-200 rounded" />
//                   </td>

//                   {/* Assigned To Skeleton */}
//                   <td className="px-4 py-3">
//                     <div className="flex items-center gap-2">
//                       <div className="w-6 h-6 bg-gray-200 rounded-full shrink-0" />
//                       <div className="w-16 h-3 bg-gray-100 rounded" />
//                     </div>
//                   </td>

//                   {/* Due Date Skeleton */}
//                   <td className="px-4 py-3">
//                     <div className="w-14 h-3 bg-gray-100 rounded" />
//                   </td>

//                   {/* Status Skeleton */}
//                   <td className="px-4 py-3">
//                     <div className="w-20 h-6 bg-gray-100 rounded-full" />
//                   </td>

//                   {/* Priority Skeleton */}
//                   <td className="px-4 py-3">
//                     <div className="w-12 h-3 bg-gray-100 rounded" />
//                   </td>

//                   {/* Action Skeleton */}
//                   <td className="px-4 py-3">
//                     <div className="w-4 h-4 bg-gray-100 rounded ml-auto" />
//                   </td>
//                 </tr>
//               ))
//             ) : tasks.length === 0 ? (
//               <tr>
//                 <td colSpan={8} className="p-12 text-center text-gray-400">
//                   No tasks found
//                 </td>
//               </tr>
//             ) : (
//               tasks.map((task) => <TaskRow key={task._id} task={task} />)
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* 🔥 PAGINATION */}
//       <div className="flex items-center justify-between">
//         <p className="text-sm text-gray-500">
//           Page {filters.page} of {totalPages}
//         </p>

//         <div className="flex gap-2">
//           <button
//             disabled={filters.page === 1}
//             onClick={() =>
//               setFilters((prev) => ({
//                 ...prev,
//                 page: prev.page - 1,
//               }))
//             }
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Prev
//           </button>

//           <button
//             disabled={filters.page === totalPages}
//             onClick={() =>
//               setFilters((prev) => ({
//                 ...prev,
//                 page: prev.page + 1,
//               }))
//             }
//             className="px-3 py-1 border rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {/* 🔥 FETCHING INDICATOR */}
//       {isFetching && <div className="h-1 bg-blue-500 animate-pulse rounded" />}
//     </div>
//   );
// };

// export default Project;

import { useSearchParams, useParams } from "react-router-dom";
import { useTasks } from "../api/queries/task.query";
import { useModal } from "../context/ModalContext";
import CreateTaskForm from "../components/CreateTaskForm";
import TaskRow from "../components/TaskRow";
import Cards from "../components/Cards";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react";
import { useStats } from "../api/queries/stats.query";
import { useProject } from "../api/queries/project.query";

const Project = () => {
  const { projectId } = useParams();
  const { openModal } = useModal();

  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
    priority: searchParams.get("priority") || "",
    page: Number(searchParams.get("page")) || 1,
    limit: 10,
  };

  const updateFilters = (newValues) => {
    const updated = {
      ...filters,
      ...newValues,
    };

    console.log(updated);

    // remove empty values
    Object.keys(updated).forEach((key) => {
      if (!updated[key]) delete updated[key];
    });

    setSearchParams(updated);
  };

  const { data, isLoading } = useTasks({
    ...filters,
    projectId,
  });

  const tasks = data?.data || [];
  const totalPages = data?.pagination.totalPages || 1;

  const { data: stats, isLoading: statsLoading } = useStats({
    scope: "project",
    projectId: projectId,
  });

  const { data: project, isLoading: projectLoading } = useProject(projectId);

  console.log("Project Data:", project);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="w-[70%]">
          <h1 className="text-2xl font-semibold">
            {projectLoading ? (
              <span className="w-100 h-6 bg-gray-200 animate-pulse rounded"></span>
            ) : (
              project?.name || "Project"
            )}
          </h1>
          <p className="text-gray-400 text-sm w-full">
            {projectLoading ? (
              <span className="h-4 bg-gray-200 animate-pulse rounded mt-1"></span>
            ) : (
              project?.description || ""
            )}
          </p>
        </div>

        <button
          onClick={() => openModal(<CreateTaskForm projectId={projectId} />)}
          className="bg-black text-white px-4 py-2 rounded-md"
        >
          + New Task
        </button>
      </div>

      {/* CARDS */}
      <Cards stats={stats} isLoading={statsLoading} />

      {/* FILTERS */}
      <div className="flex gap-3 flex-wrap">
        <input
          placeholder="Search tasks..."
          className="border px-3 py-2 rounded-md w-64 text-sm"
          value={filters.search}
          onChange={(e) =>
            updateFilters({
              search: e.target.value,
              page: 1,
            })
          }
        />

        <div className="relative">
          <select
            value={filters.status}
            className="h-9 w-36 border border-gray-200 rounded-md px-3 text-sm appearance-none bg-white"
            onChange={(e) =>
              updateFilters({
                status: e.target.value,
                page: 1,
              })
            }
          >
            <option value="">Status</option>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="submitted">Submitted</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            size={14}
          />
        </div>

        <div className="relative">
          <select
            value={filters.priority}
            className="h-9 w-36 border border-gray-200 rounded-md px-3 text-sm appearance-none bg-white"
            onChange={(e) =>
              updateFilters({
                priority: e.target.value,
                page: 1,
              })
            }
          >
            <option value="">Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <ChevronDown
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
            size={14}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="border border-gray-200 rounded overflow-hidden">
        <table className="table-fixed w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase">
            <tr>
              <th className="px-4 py-3 text-left w-[20%]">
                <div className="flex">
                  Title{" "}
                  <span>
                    <ChevronsUpDown size={16} />
                  </span>
                </div>
              </th>

              <th className="px-4 py-3 text-left w-[15%]">
                <div className="flex">
                  <p className="inline-block">Assigned</p>
                  <span>
                    <ChevronsUpDown size={16} />
                  </span>
                </div>
              </th>
              <th className="px-4 py-3 text-left w-[15%]">
                <div className="flex">
                  Due{" "}
                  <span>
                    <ChevronsUpDown size={16} />
                  </span>
                </div>
              </th>
              <th className="px-4 py-3 text-left w-[15%]">
                <div className="flex">
                  Status{" "}
                  <span>
                    <ChevronsUpDown size={16} />
                  </span>
                </div>
              </th>
              <th className="px-4 py-3 text-left w-[15%]">
                <div className="flex">
                  Priority{" "}
                  <span>
                    <ChevronsUpDown size={16} />
                  </span>
                </div>
              </th>
              <th className="px-4 py-3 text-center w-[5%]"></th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse border-b">
                  <td className="px-4 py-3">
                    <div className="w-32 h-4 bg-gray-200 rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full" />
                      <div className="w-16 h-3 bg-gray-100 rounded" />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-14 h-3 bg-gray-100 rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-20 h-6 bg-gray-100 rounded-full" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-12 h-3 bg-gray-100 rounded" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="w-4 h-4 bg-gray-100 rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-12 text-center text-gray-400">
                  No tasks found
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <TaskRow key={task._id} task={task} scope="project" />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Page {filters.page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={filters.page === 1}
            onClick={() => updateFilters({ page: filters.page - 1 })}
            className="flex items-center px-3 py-1 border rounded disabled:opacity-50"
          >
            <span>
              <ChevronLeft size={16} />
            </span>{" "}
            Previous
          </button>

          <button
            disabled={filters.page === totalPages}
            onClick={() => updateFilters({ page: filters.page + 1 })}
            className="flex items-center px-4 py-1 border rounded disabled:opacity-50"
          >
            Next
            <span>
              <ChevronRight size={16} />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Project;
