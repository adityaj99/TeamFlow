import { useState } from "react";
import { useModal } from "../context/ModalContext";
import { useUpdateTaskStatus } from "../api/mutations/task.mutation";

const SubmitTaskForm = ({ task }) => {
  const { closeModal } = useModal();
  const { mutate: updateTask, isPending } = useUpdateTaskStatus();

  const [note, setNote] = useState("");
  const [attachments, setAttachments] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const files = attachments
      ? attachments.split(",").map((f) => f.trim())
      : [];

    if (!note && files.length === 0) {
      return setError("Add note or attachment");
    }

    updateTask(
      {
        id: task._id,
        data: {
          status: "submitted",
          submission: {
            note,
            attachments: files,
          },
        },
      },
      {
        onSuccess: () => closeModal(),
        onError: (err) => setError(err.response?.data?.message || "Failed"),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-semibold">Submit Task</h2>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <textarea
        placeholder="Add note (optional)"
        className="w-full border p-2 rounded"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <input
        placeholder="Attachments (comma separated URLs)"
        className="w-full border p-2 rounded"
        value={attachments}
        onChange={(e) => setAttachments(e.target.value)}
      />

      <button
        disabled={isPending}
        className="bg-black text-white w-full py-2 rounded"
      >
        {isPending ? "Submitting..." : "Submit Task"}
      </button>
    </form>
  );
};

export default SubmitTaskForm;
