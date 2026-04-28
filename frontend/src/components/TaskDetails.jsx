import dateFormat from "../utils/dateFormat";
import { getAvatar } from "../utils/getAvatar";

const TaskDetails = ({ task }) => {
  return (
    <div className="space-y-6">
      {/* TITLE + DESCRIPTION */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>

        <p className="text-sm text-gray-500">
          {task.description || "No description provided."}
        </p>
      </div>

      {/* META CARDS */}
      <div className="grid grid-cols-2 gap-4">
        {/* Assigned */}
        <div className="p-3 border border-gray-200 rounded-lg bg-white">
          <p className="text-xs text-gray-400 mb-1">Assigned To</p>
          <div className="flex items-center gap-2">
            <img
              className="w-6 h-6 rounded-full object-cover"
              src={getAvatar(task.assignedTo)}
              alt=""
            />
            <p className="text-sm font-medium">
              {task.assignedTo?.name || "Unassigned"}
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="p-3 border border-gray-200 rounded-lg bg-white">
          <p className="text-xs text-gray-400 mb-1">Status</p>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              task.status === "approved"
                ? "bg-green-100 text-green-600"
                : task.status === "rejected"
                  ? "bg-red-100 text-red-600"
                  : task.status === "submitted"
                    ? "bg-blue-100 text-blue-600"
                    : task.status === "in_progress"
                      ? "bg-yellow-100 text-yellow-600"
                      : "bg-gray-100 text-gray-600"
            }`}
          >
            {task.status.replace("_", " ")}
          </span>
        </div>

        {/* Priority */}
        <div className="p-3 border border-gray-200 rounded-lg bg-white">
          <p className="text-xs text-gray-400 mb-1">Priority</p>
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              task.priority === "high"
                ? "bg-red-100 text-red-600"
                : task.priority === "medium"
                  ? "bg-yellow-100 text-yellow-600"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {task.priority}
          </span>
        </div>

        {/* Due Date */}
        <div className="p-3 border border-gray-200 rounded-lg bg-white">
          <p className="text-xs text-gray-400 mb-1">Due Date</p>
          <p className="text-sm font-medium">
            {task.dueDate
              ? new Date(task.dueDate).toLocaleDateString()
              : "No deadline"}
          </p>
        </div>
      </div>

      {/* SUBMISSION CARD */}
      {task.submission && (
        <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-2">
          <p className="text-sm font-semibold text-gray-700">Submission</p>

          <p className="text-sm text-gray-600">
            {task.submission.note || "No note added"}
          </p>

          {task.submission.attachments?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {task.submission.attachments.map((file, i) => (
                <a
                  key={i}
                  href={file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-500 cursor-pointer"
                >
                  <span className="text-black decoration-0">{i + 1}.</span>{" "}
                  Attachment
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FOOTER */}
      <div className="flex justify-between text-xs text-gray-400">
        <div className="flex items-center gap-2">
          <span>Created by</span>
          <div className="flex items-center gap-1">
            <img
              className="h-7 w-7 rounded-full object-cover"
              src={getAvatar(task.createdBy)}
              alt=""
            />
            <p>{task.createdBy.name || "Unknown"}</p>
          </div>
        </div>

        <p>{dateFormat(task.createdAt)}</p>
      </div>
    </div>
  );
};

export default TaskDetails;
