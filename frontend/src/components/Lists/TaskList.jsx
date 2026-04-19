import dateFormat from "../../utils/dateFormat";

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
              <p className="bg-gray-100 px-2 py-1 rounded">Todo</p>
              <p className="bg-gray-100 px-2 py-1 rounded">Medium</p>
              <div className="h-8 w-8 bg-blue-300 rounded-full"></div>
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
