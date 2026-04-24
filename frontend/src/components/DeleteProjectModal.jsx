import { toast } from "sonner";
import { useDeleteProject } from "../api/mutations/project.mutation";
import { useModal } from "../context/ModalContext";
import { useNavigate } from "react-router-dom";

const DeleteProjectModal = ({ project }) => {
  const { mutate: deleteProject, isPending: deleting } = useDeleteProject();
  const { closeModal } = useModal();
  const navigate = useNavigate();

  const handleDelete = () => {
    closeModal();

    let isCancelled = false;

    const timer = setTimeout(() => {
      if (!isCancelled) {
        deleteProject(project._id);
      }
    }, 4000);

    toast.custom(
      (id) => (
        <div className="flex flex-col gap-2 bg-white px-4 py-3 rounded shadow-md">
          <span className="text-sm font-medium">Project will be deleted</span>

          <span className="text-xs text-gray-500">
            All tasks inside this project will also be removed
          </span>

          <button
            onClick={() => {
              isCancelled = true;
              clearTimeout(timer);
              toast.dismiss(id);
            }}
            className="text-blue-500 font-semibold text-xs text-left uppercase cursor-pointer hover:underline"
          >
            Undo
          </button>
        </div>
      ),
      {
        duration: 4000,
      },
    );
  };

  return (
    <div className="w-95 space-y-4">
      <h2 className="text-lg font-semibold mb-2">Delete Project</h2>

      <p className="text-sm text-gray-500 mb-4">
        This will permanently delete{" "}
        <span className="font-medium">{project.name}</span> and all its tasks.
      </p>

      <div className="flex justify-end gap-2">
        <button
          onClick={closeModal}
          className={`px-3 py-1 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer`}
        >
          Cancel
        </button>

        <button
          disabled={deleting}
          onClick={handleDelete}
          className={`px-3 py-1 bg-red-500 text-white rounded hover:opacity-90 ${deleting ? "cursor-not-allowed" : "cursor-pointer"}  `}
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default DeleteProjectModal;
