const TaskList = () => {
  const tasks = [
    {
      _id: "Task-1",
      title: "Automation Quality Inspection System",
      date: "Janunary 11th 2026",
      createdBy: "Aditya J",
    },
    {
      _id: "Task-2",
      title: "Automation Quality Inspection System",
      date: "Janunary 11th 2026",
      createdBy: "Aditya J",
    },
    {
      _id: "Task-3",
      title: "Automation Quality Inspection System",
      date: "Janunary 11th 2026",
      createdBy: "Aditya J",
    },
    {
      _id: "Task-4",
      title: "Automation Quality Inspection System",
      date: "Janunary 11th 2026",
      createdBy: "Aditya J",
    },
    {
      _id: "Task-5",
      title: "Automation Quality Inspection System",
      date: "Janunary 11th 2026",
      createdBy: "Aditya J",
    },
    {
      _id: "Task-6",
      title: "Automation Quality Inspection System",
      date: "Janunary 11th 2026",
      createdBy: "Aditya J",
    },
  ];

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
                <p className="text-gray-400">{task.date}</p>
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
