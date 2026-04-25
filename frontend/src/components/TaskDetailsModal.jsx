import { useState } from "react";
import ActivityTimeline from "./ActivityTimeline";
import TaskDetails from "./TaskDetails";
import TaskDiscussion from "./TaskDiscussion";

const TaskDetailsModal = ({ task }) => {
  const [tab, setTab] = useState("details");

  console.log(task);

  return (
    <div className="w-150 p-4 space-y-4">
      <h2 className="font-semibold">{task.title}</h2>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          className={`py-2 px-4 cursor-pointer ${tab === "details" && "border-b-2 border-b-gray-700 bg-gray-100"} `}
          onClick={() => setTab("details")}
        >
          Details
        </button>
        <button
          className={`py-2 px-4 cursor-pointer ${tab === "activity" && "border-b-2 border-b-gray-400 bg-gray-100"} `}
          onClick={() => setTab("activity")}
        >
          Activity
        </button>
        <button
          className={`py-2 px-4 cursor-pointer ${tab === "discussion" && "border-b-2 border-b-gray-400 bg-gray-100"} `}
          onClick={() => setTab("discussion")}
        >
          Discussion
        </button>
      </div>

      {/* Content */}
      {tab === "details" && (
        <div>
          <TaskDetails task={task} />
        </div>
      )}

      {tab === "activity" && (
        <ActivityTimeline targetId={task._id} targetType="Task" />
      )}

      {tab === "discussion" && <TaskDiscussion taskId={task._id} />}
    </div>
  );
};

export default TaskDetailsModal;
