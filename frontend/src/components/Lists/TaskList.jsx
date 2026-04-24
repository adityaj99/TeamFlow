import dateFormat from "../../utils/dateFormat";
import { getAvatar } from "../../utils/getAvatar";

const TaskList = ({ tasks = [], isLoading }) => {
  if (isLoading)
    return (
      <div className="flex flex-col gap-2 mt-4">
        {[1, 2, 3, 4, 5, 6].map((_, indx) => (
          <div key={indx} className="flex items-center justify-between p-2">
            <div className="flex flex-col gap-2">
              <div className="w-35 h-4 bg-gray-100 animate-pulse rounded"></div>
              <div className="w-60 h-4 bg-gray-100 animate-pulse rounded"></div>
              <div className="w-30 h-4 bg-gray-100 animate-pulse rounded"></div>
            </div>
            <div className="flex gap-2">
              <div className="w-15 h-7 bg-gray-100 animate-pulse rounded"></div>
              <div className="w-15 h-7 bg-gray-100 animate-pulse rounded"></div>
              <div className="w-7 h-7 bg-gray-100 animate-pulse rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );

  console.log(tasks);

  return (
    <div className="flex flex-col mt-4">
      {tasks?.length > 0 ? (
        tasks?.map((task) => (
          <div
            key={task._id}
            className="flex items-center justify-between p-2 border-b border-gray-200"
          >
            <div className="flex flex-col">
              <p className="text-gray-500">{task._id}</p>
              <div className="flex flex-col">
                <p className="font-semibold">{task.title}</p>
                <p className="text-gray-400">{dateFormat(task.createdAt)}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <p
                className={`text-center bg-gray-100 py-1 px-4 uppercase font-semibold text-xs rounded ${task.status === "todo" ? "text-gray-800 bg-gray-100" : task.status === "in_progress" ? "text-blue-800 bg-blue-100" : task.status === "submitted" ? "text-yellow-800 bg-yellow-100" : task.status === "approved" ? "text-green-500 bg-green-100" : "text-red-500 bg-red-100"}`}
              >
                {task.status || "Todo"}
              </p>
              <p
                className={`text-center uppercase text-xs font-semibold  py-1 px-4 rounded ${task.priority === "high" ? "bg-red-100 text-red-800" : task.priority === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"}`}
              >
                {task.priority || "Medium"}
              </p>

              <img
                className="w-9 h-9 rounded-full object-cover"
                src={getAvatar(task.assignedTo)}
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=User&background=random`;
                }}
                alt="avatar"
              />
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-400 p-6">
          <p>There is no project yet.</p>
          <p>Please create for workspace.</p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
