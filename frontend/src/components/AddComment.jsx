import { useState } from "react";
import { useCreateComment } from "../api/mutations/comment.mutation";

const AddComment = ({ taskId, parentComment = null, onSuccessCallback }) => {
  const [text, setText] = useState("");
  const { mutate: addComment, isPending } = useCreateComment();

  const handleSubmit = () => {
    if (!text.trim()) return;

    addComment(
      {
        content: text,
        task: taskId,
        parentComment,
      },
      {
        onSuccess: () => {
          setText("");
          if (onSuccessCallback) {
            onSuccessCallback();
          }
        },
      },
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Write a message..."
        disabled={isPending}
        className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
      />

      <button
        onClick={handleSubmit}
        disabled={isPending || !text.trim()}
        className="bg-black text-white px-4 py-2 rounded-full text-sm"
      >
        Send
      </button>
    </div>
  );
};

export default AddComment;
