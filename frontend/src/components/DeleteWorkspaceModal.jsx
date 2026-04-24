import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { useDeleteOrg } from "../api/mutations/org.mutation";
import { useModal } from "../context/ModalContext";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const DeleteWorkspaceModal = ({ orgName }) => {
  const [confirmText, setConfirmText] = useState("");
  const { closeModal } = useModal();
  const navigate = useNavigate();

  const { mutate, isPending } = useDeleteOrg();

  const handleDelete = () => {
    mutate(undefined, {
      onSuccess: () => {
        closeModal();
        toast.success("Workspace deleted");
        navigate("/");
      },
    });
  };

  return (
    <div className="w-95 space-y-5 animate-fadeIn">
      {/* 🔥 Header */}
      <div className="flex items-center gap-3">
        <div className="bg-red-100 text-red-500 p-2 rounded-full">
          <AlertTriangle size={30} />
        </div>

        <div>
          <h2 className="text-lg font-semibold text-red-600">
            Delete {orgName} Workspace
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            This action{" "}
            <span className="font-semibold text-red-500">cannot be undone</span>
          </p>
        </div>
      </div>

      {/* 🔥 Confirmation input */}
      <div className="space-y-2">
        <p className="text-sm text-gray-600">
          Type <span className="font-semibold text-black">DELETE</span> to
          confirm.
        </p>

        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          className="w-full border border-gray-200 p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
        />
      </div>

      {/* 🔥 Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          onClick={closeModal}
          className="px-4 py-2 rounded border border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          disabled={confirmText !== "DELETE" || isPending}
          className={`px-3 py-1 bg-red-500 text-white rounded cursor-pointer hover:opacity-90 ${confirmText !== "DELETE" ? "cursor-not-allowed" : "cursor-pointer"}  `}
        >
          {isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
};

export default DeleteWorkspaceModal;
