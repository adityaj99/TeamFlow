import { toast } from "sonner";
import { useDeleteTask } from "../api/mutations/task.mutation";
import { useModal } from "../context/ModalContext";

const DeleteTaskModal = ({ task }) => {
  const { mutate: deleteTask, isPending } = useDeleteTask();
  const { closeModal } = useModal();

  const handleDelete = () => {
    deleteTask(task?._id, {
      onSuccess: () => {
        closeModal();
        toast.success("Task deleted!");
      },
    });
  };

  return (
    <div className="w-90 space-y-2">
      <h2 className="text-xl font-semibold">Delete Task</h2>

      <p className="text-sm text-gray-400">
        Are you sure you want to delete{" "}
        <span className="font-medium">{task.title}</span>? This action cannot be
        undone.
      </p>

      <div className="flex justify-end gap-2">
        <button
          disabled={isPending}
          onClick={closeModal}
          className="px-3 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          disabled={isPending}
          onClick={handleDelete}
          className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer hover:opacity-90"
        >
          {isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
