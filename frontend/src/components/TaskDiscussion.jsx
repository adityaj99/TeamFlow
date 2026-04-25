import { useEffect, useRef } from "react";
import { useComments } from "../api/queries/comment.query";
import AddComment from "./AddComment";
import CommentList from "./Lists/CommentList";

const TaskDiscussion = ({ taskId }) => {
  const { data: comments = [] } = useComments(taskId);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  return (
    <div className="flex flex-col h-100">
      <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 space-y-4">
        <CommentList taskId={taskId} />
      </div>

      <div className="border-t border-gray-200 pt-3 mt-2">
        <AddComment taskId={taskId} />
      </div>
    </div>
  );
};

export default TaskDiscussion;
