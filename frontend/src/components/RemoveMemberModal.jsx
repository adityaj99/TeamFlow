import { toast } from "sonner";
import { useRemoveMember } from "../api/mutations/membership.mutation";
import { useModal } from "../context/ModalContext";

const RemoveMemberModal = ({ member }) => {
  const { mutate: removeMember, isPending } = useRemoveMember();
  const { closeModal } = useModal();

  const handleRemove = () => {
    removeMember(member._id, {
      onSuccess: () => {
        closeModal();
        toast.success(`${member.name} removed successfully!`);
      },
      onError: (err) => {
        toast.error(err.response?.data?.message || "Failed to remove member");
      },
    });
  };

  return (
    <div className="w-90 space-y-3">
      <h2 className="text-xl font-semibold">Remove Member</h2>

      <p className="text-sm text-gray-400">
        Are you sure you want to remove{" "}
        <span className="font-medium text-black">{member.name}</span> from the
        workspace? They will lose access to all projects and tasks.
      </p>

      <div className="flex justify-end gap-2 pt-2">
        <button
          disabled={isPending}
          onClick={closeModal}
          className="px-3 py-1 border border-gray-200 rounded cursor-pointer hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          disabled={isPending}
          onClick={handleRemove}
          className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer hover:opacity-90 disabled:opacity-50 transition"
        >
          {isPending ? "Removing..." : "Remove"}
        </button>
      </div>
    </div>
  );
};

export default RemoveMemberModal;
