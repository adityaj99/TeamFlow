import { useSearchParams } from "react-router-dom";
import { useTasks } from "../api/queries/task.query";
import { useModal } from "../context/ModalContext";
import CreateTaskForm from "../components/CreateTaskForm";
import TaskRow from "../components/TaskRow";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../api/queries/auth.query";

const Tasks = () => {
  const { openModal } = useModal();

  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState(
    searchParams.get("search") || "",
  );

  const filters = {
    search: searchParams.get("search") || "",
    status: searchParams.get("status") || "",
    priority: searchParams.get("priority") || "",
    page: parseInt(searchParams.get("page")) || 1,
    limit: 10,
  };

  const { data: userData } = useAuth();
  const canCreate = ["owner", "admin", "manager"].includes(
    userData?.membership?.role,
  );

  const { data, isLoading } = useTasks(filters);

  const tasks = data?.data || [];
  const totalPages = data?.pagination?.totalPages || 1;

  const updateFilters = (newValues) => {
    const updated = { ...filters, ...newValues };

    Object.keys(updated).forEach((key) => {
      if (!updated[key]) {
        delete updated[key];
      }
    });
    setSearchParams(updated);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== filters.search) {
        updateFilters({ search: localSearch, page: 1 });
      }
    }, 500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localSearch]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">All Tasks</h1>
          <p className="text-gray-400 text-sm">
            Manage and track all your workspace tasks
          </p>
        </div>

        {canCreate && (
          <button
            onClick={() => openModal(<CreateTaskForm />)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-900 cursor-pointer transition"
          >
            + New Task
          </button>
        )}
      </div>

      {/* FILTERS */}
      <div className="flex gap-3 flex-wrap">
        <input
          placeholder="Search tasks..."
          className="border border-gray-200 px-3 py-2 rounded-md w-64 text-sm focus:outline-none focus:ring-1 focus:ring-black"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />

        <div className="relative">
          <select
            className="h-9 w-36 border border-gray-200 rounded-md px-3 text-sm appearance-none bg-white"
            onChange={(e) => updateFilters({ status: e.target.value, page: 1 })}
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
            className="h-9 w-36 border border-gray-200 rounded-md px-3 text-sm appearance-none bg-white"
            onChange={(e) =>
              updateFilters({ priority: e.target.value, page: 1 })
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
      <div className="border border-gray-200 rounded overflow-y-visible">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-gray-50 text-gray-500 text-xs">
            <tr>
              <th className="px-4 py-3 text-left w-[25%]">
                <div className="flex">
                  Title{" "}
                  <span>
                    <ChevronsUpDown size={16} />
                  </span>
                </div>
              </th>
              <th className="px-4 py-3 text-left w-[15%]">
                <div className="flex">
                  Project
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
              <th className="px-4 py-3 text-left w-[18%]">
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
              <th className="px-4 py-3 text-left w-[12%]">
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
                <tr
                  key={i}
                  className="border-b border-gray-50 last:border-0 animate-pulse"
                >
                  <td className="px-4 py-3">
                    <div className="w-32 h-4 bg-gray-200 rounded" />
                  </td>

                  {/* Project Skeleton */}
                  <td className="px-4 py-3">
                    <div className="w-20 h-4 bg-gray-100 rounded" />
                  </td>

                  {/* Assigned To Skeleton */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-200 rounded-full shrink-0" />
                      <div className="w-16 h-3 bg-gray-100 rounded" />
                    </div>
                  </td>

                  {/* Due Date Skeleton */}
                  <td className="px-4 py-3">
                    <div className="w-14 h-3 bg-gray-100 rounded" />
                  </td>

                  {/* Status Skeleton */}
                  <td className="px-4 py-3">
                    <div className="w-20 h-6 bg-gray-100 rounded-full" />
                  </td>

                  {/* Priority Skeleton */}
                  <td className="px-4 py-3">
                    <div className="w-12 h-3 bg-gray-100 rounded" />
                  </td>

                  {/* Action Skeleton */}
                  <td className="px-4 py-3">
                    <div className="w-4 h-4 bg-gray-100 rounded ml-auto" />
                  </td>
                </tr>
              ))
            ) : tasks.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-12 text-center text-gray-400">
                  No tasks found
                </td>
              </tr>
            ) : (
              tasks.map((task) => <TaskRow key={task._id} task={task} />)
            )}
          </tbody>
        </table>
      </div>

      {/* 🔥 PAGINATION */}
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

export default Tasks;
