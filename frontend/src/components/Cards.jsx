import { Activity } from "lucide-react";

const Cards = ({ stats }) => {
  const cardData = [
    {
      title: "Total tasks",
      numbers: stats?.totalTasks || 0,
    },
    {
      title: "Pending tasks",
      numbers: stats?.pendingTasks || 0,
    },
    {
      title: "Completed tasks",
      numbers: stats?.completedTasks || 0,
    },
  ];

  return (
    <div className="flex items-center justify-start gap-6">
      {/* card */}
      {cardData.map((item, index) => (
        <div
          key={index}
          className="flex flex-col gap-2 w-full border border-gray-200 rounded-xl p-4"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm">{item.title}</p>
            <Activity width={15} />
          </div>
          <div>
            <p className="text-2xl font-bold">{item.numbers}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Cards;
