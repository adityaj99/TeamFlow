import React from "react";
import { useInfiniteAudits } from "../api/queries/audit.query";
import { History } from "lucide-react";

const ActivityTimeline = ({ targetId, targetType }) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteAudits({ targetId, targetType });

  console.log("Audit Logs:", data);

  // 🔥 flatten pages
  const logs = data?.pages?.flatMap((page) => page.data) || [];

  const isEmpty = logs.length === 0;

  const grouped = groupByDate(logs);

  console.log("Grouped Logs:", grouped);

  const formatAction = (log) => {
    switch (log.action) {
      case "UPDATE_STATUS":
        return `changed status `;

      case "UPDATE_TASK":
        return "updated task details";

      case "DELETE_TASK":
        return "deleted the task";

      default:
        return log.action.toLowerCase();
    }
  };

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
          <History />
        </div>

        <p className="text-sm font-medium text-gray-700">No activity yet</p>

        <p className="text-xs text-gray-400 mt-1">
          Actions on this task will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-100 overflow-y-auto pr-2">
      {Object.entries(grouped).map(([date, items]) => (
        <div key={date}>
          {/* 🔥 Date Header */}
          <p className="text-xs text-gray-400 mb-2">{date}</p>

          <div className="space-y-4">
            {items.map((log) => (
              <div key={log._id} className="flex gap-3">
                {/* Timeline Dot */}
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 bg-black rounded-full mt-2" />
                  <div className="flex-1 top-4 w-px bg-gray-200" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">{log.user?.name}</span>{" "}
                    {formatAction(log)}
                  </p>

                  {log.metadata?.from && log.metadata?.to && (
                    <div className="flex gap-2 items-center">
                      <span
                        className={`uppercase font-semibold text-xs p-1 bg-gray-100 ${log.metadata.from === "todo" ? "bg-blue-100 text-blue-800" : log.metadata.from === "in_progress" ? "bg-yellow-100 text-yellow-800" : log.metadata.from === "approved" ? "bg-green-100 text-green-800" : log.metadata.from === "rejected" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {log.metadata.from}
                      </span>
                      <span>→</span>
                      <span
                        className={`uppercase font-semibold text-xs p-1 bg-gray-100 ${log.metadata.to === "todo" ? "bg-blue-100 text-blue-800" : log.metadata.to === "in_progress" ? "bg-yellow-100 text-yellow-800" : log.metadata.to === "approved" ? "bg-green-100 text-green-800" : log.metadata.to === "rejected" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"}`}
                      >
                        {log.metadata.to}
                      </span>
                    </div>
                  )}

                  <span className="text-xs text-gray-400">
                    {new Date(log.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 🔥 Load More */}
      {hasNextPage && (
        <button onClick={fetchNextPage} className="text-sm text-blue-500">
          {isFetchingNextPage ? "Loading..." : "Load more"}
        </button>
      )}
    </div>
  );
};

const groupByDate = (logs) => {
  const groupes = {};

  logs.forEach((log) => {
    const date = new Date(log.createdAt);
    const today = new Date();

    let key = date.toDateString();

    if (date.toDateString() === today.toDateString()) {
      key = "Today";
    } else if (
      new Date(today.setDate(today.getDate() - 1)).toDateString() ===
      date.toDateString()
    ) {
      key = "Yesterday";
    }

    if (!groupes[key]) groupes[key] = [];
    groupes[key].push(log);
  });
  return groupes;
};

export default ActivityTimeline;
