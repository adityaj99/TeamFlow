import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

import { useReplies } from "../api/queries/comment.query";
import AddComment from "./AddComment";
import { getAvatar } from "../utils/getAvatar";

const CommentItem = ({ comment, isReply }) => {
  const [showReplies, setShowReplies] = useState(false);
  const [replying, setReplying] = useState(false);

  const { data: replies = [] } = useReplies(comment._id, showReplies);

  return (
    <div
      className={`flex gap-3 mt-5 ${isReply && "border-b border-gray-200 p-2 rounded-xl"}`}
    >
      {/* Avatar */}
      <img
        className="h-8 w-8 rounded-full object-cover"
        src={getAvatar(comment.user)}
        alt=""
      />

      {/* Message */}
      <div className="flex-1">
        {/* Header */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">{comment.user?.name}</span>

          <span className="text-xs text-gray-400">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        {/* Bubble */}
        <div className="bg-gray-100 px-3 py-2 rounded-lg mt-1 text-sm text-gray-700 w-fit max-w-[80%]">
          {comment.content}
        </div>

        {/* Actions */}
        <div className="flex gap-3 text-xs text-gray-400 mt-1">
          <button onClick={() => setReplying((p) => !p)}>
            {replying ? "Cancel" : "Reply"}
          </button>

          <button
            className="hover:text-black transition"
            onClick={() => setShowReplies((p) => !p)}
          >
            {showReplies ? "Hide replies" : "View replies"}
          </button>
        </div>

        {/* Reply Input */}
        {replying && (
          <div className="mt-2">
            <AddComment
              taskId={comment.task}
              parentComment={comment._id}
              onSuccessCallback={() => {
                setReplying(false);
                setShowReplies(true);
              }}
            />
          </div>
        )}

        {/* Replies */}
        {showReplies && (
          <div className="ml-4 border-l border-gray-200 rounded-xl space-y-3">
            {replies.map((reply) => (
              <CommentItem key={reply._id} comment={reply} isReply={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
