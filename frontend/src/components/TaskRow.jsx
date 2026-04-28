import { useUpdateTaskStatus } from "../api/mutations/task.mutation";
import { useAuth } from "../api/queries/auth.query";
import { useModal } from "../context/ModalContext";
import SubmitTaskForm from "./SubmitTaskForm";
import dateFormat from "../utils/dateFormat";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  CalendarCheck,
  Circle,
  CircleCheckBig,
  Ellipsis,
  Info,
  Pencil,
  Timer,
  Trash2,
  X,
} from "lucide-react";
import { getAvatar } from "../utils/getAvatar";
import { useEffect, useRef, useState } from "react";
import CreateTaskForm from "./CreateTaskForm";
import DeleteTaskModal from "./DeleteTaskModal";
import TaskDetailsModal from "./TaskDetailsModal";

const TaskRow = ({ task, scope }) => {
  const { mutate: updateTask } = useUpdateTaskStatus();
  const { data: userData } = useAuth();
  const { openModal } = useModal();

  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  const handleStatusChange = (e) => {
    const value = e.target.value;

    if (value === "submitted") {
      openModal(<SubmitTaskForm task={task} />);
      return;
    }

    updateTask(
      { id: task._id, data: { status: value } },
      {
        onError: (err) => {
          alert(err.response?.data?.message || "Update failed");
        },
      },
    );
  };

  const transitions = {
    todo: ["in_progress"],
    in_progress: ["submitted"],
    submitted: ["approved", "rejected", "in_progress"],
    approved: [],
    rejected: ["in_progress"],
  };

  const isAdmin = ["admin", "owner", "manager"].includes(
    userData?.membership?.role,
  );

  const getAllowedStatuses = (task, user) => {
    const isAdmin = ["admin", "owner", "manager"].includes(
      user?.membership?.role,
    );
    const isAssigned = task.assignedTo?._id === user?.user?._id;

    const current = task.status;
    let allowed = transitions[current] || [];

    if (!isAdmin && current === "submitted") return [current];

    if (!isAdmin) {
      allowed = allowed.filter((s) => !["approved", "rejected"].includes(s));
    }

    if (!isAssigned && !isAdmin) return [current];

    return [current, ...allowed];
  };

  const allowedStatuses = getAllowedStatuses(task, userData);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!menuRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <tr className="relative border-b border-gray-100 hover:bg-gray-50 transition-all">
      {/* TITLE (WIDER) */}
      <td
        className={`px-4 py-3 w-[20%] ${scope === "project" ? "w-[10%]" : ""}`}
      >
        <p className="font-medium text-gray-800" title={task.title}>
          {task.title}
        </p>
      </td>

      {/* PROJECT (WIDER) */}
      {!scope && (
        <td className="px-4 py-3 w-[15%]">
          <p className="text-gray-600 truncate">{task.project?.name}</p>
        </td>
      )}

      {/* ASSIGNED (WIDER) */}
      <td
        className={`px-4 py-3 w-[15%] truncate ${scope === "project" ? "w-[20%]" : ""}`}
      >
        {task.assignedTo ? (
          <div className="flex items-center gap-2">
            <img
              className="w-7 h-7 rounded-full object-cover"
              src={getAvatar(task.assignedTo)}
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=User&background=random`;
              }}
              alt="avatar"
            />

            <span className="text-gray-700 truncate">
              {task.assignedTo.name}
            </span>
          </div>
        ) : (
          <span className="text-gray-400 text-sm">Unassigned</span>
        )}
      </td>

      {/* DUE DATE */}
      <td
        className={`px-4 py-3 w-[15%] text-gray-500 text-sm ${scope === "project" ? "w-[20%]" : ""}`}
      >
        {task.dueDate ? dateFormat(task.dueDate) : "-"}
      </td>

      {/* STATUS */}
      <td
        className={`px-4 py-3 w-[15%] ${scope === "project" ? "w-[20%]" : ""}`}
      >
        {allowedStatuses.length > 1 ? (
          <select
            value={task.status}
            onChange={handleStatusChange}
            className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-black"
          >
            {allowedStatuses.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        ) : (
          <span
            className={`flex justify-start gap-1 w-fit text-xs ${task.status === "todo" ? "text-blue-400 bg-blue-100" : task.status === "in_progress" ? "text-yellow-400 bg-yellow-100" : task.status === "approved" ? "text-green-400 bg-green-100" : task.status === "rejected" ? "text-red-400 bg-red-100" : "text-gray-400 bg-gray-100"} px-2 py-1 rounded uppercase font-semibold`}
          >
            <span>
              {task.status === "todo" && <Circle size={16} />}
              {task.status === "in_progress" && <Timer size={16} />}
              {task.status === "approved" && <CircleCheckBig size={16} />}
              {task.status === "rejected" && <X size={16} />}
              {task.status === "submitted" && <CalendarCheck size={16} />}
            </span>
            {task.status.replace("_", " ")}
            {/* in_progress */}
          </span>
        )}
      </td>

      {/* PRIORITY */}
      <td
        className={`px-4 py-3 w-[15%] ${scope === "project" ? "w-[20%]" : ""}`}
      >
        <span
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium uppercase ${
            task.priority === "high"
              ? " text-red-600"
              : task.priority === "medium"
                ? " text-yellow-700"
                : " text-gray-600"
          }`}
        >
          {task.priority}
          <span>
            {task.priority === "high" && <ArrowUp size={12} />}
            {task.priority === "medium" && <ArrowRight size={12} />}
            {task.priority === "low" && <ArrowDown size={12} />}
          </span>
        </span>
      </td>

      {/* ACTION */}

      <td
        className="relative px-4 py-3 w-[5%] cursor-pointer text-center"
        ref={menuRef}
      >
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="p-1 rounded hover:bg-gray-100"
        >
          <Ellipsis size={16} />
        </button>

        {open && (
          <div className="absolute right-12 top-0 w-36 bg-white border border-gray-200 rounded-xl shadow-md p-1 z-50">
            <button
              onClick={() => openModal(<TaskDetailsModal task={task} />)}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-xl"
            >
              <Info size={14} />
              Details
            </button>

            {isAdmin && (
              <>
                {" "}
                <button
                  onClick={() => {
                    setOpen(false);
                    openModal(<CreateTaskForm editTask={task} />);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-xl"
                >
                  <Pencil size={14} />
                  Edit
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    openModal(<DeleteTaskModal task={task} />);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 rounded-xl"
                >
                  <Trash2 size={14} />
                  Delete
                </button>{" "}
              </>
            )}
          </div>
        )}
      </td>
    </tr>
  );
};

export default TaskRow;
