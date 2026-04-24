import { History } from "lucide-react";
import ActivityTimeline from "./ActivityTimeline";

const TaskActivityModal = ({ taskId }) => {
  return (
    <div className="p-4 w-105">
      <h2 className="flex items-center gap-2 text-xl font-semibold mb-4">
        <History size={18} />
        Activity
      </h2>

      <ActivityTimeline targetId={taskId} targetType="Task" />
    </div>
  );
};

export default TaskActivityModal;
