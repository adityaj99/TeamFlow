import { useState } from "react";
import { useModal } from "../context/ModalContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import workspace from "../../public/images/workspace.jpg";

const CreateWorkspaceForm = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async (data) => {
      const res = await api.post("/api/org", data);
      return res.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orgs"] });
      closeModal();
      //   await api.post("/api/membership/switch-org", { orgId });
    },

    onError: (err) => {
      setError(err.response?.data?.message || "Failed to create workspace");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    mutate({ name, description });
  };

  return (
    <div className="flex gap-10 w-200">
      <form onSubmit={handleSubmit} className="space-y-5 w-1/2">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Let's build Workspace</h2>
          <p className="text-gray-400">
            Boost your productivity by making it easier to everyone to access
            projects in one location.
          </p>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="space-y-1">
          <p>Workspace name</p>
          <input
            type="text"
            placeholder="Workspace name"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="text-xs text-gray-400">
            This is the nae of department in your organization.
          </p>
        </div>

        <div className="space-y-1">
          <p>Workspace description</p>
          <textarea
            type="text"
            placeholder="e.g. Our team organize projects and tasks here"
            className="w-full border p-2 rounded"
            value={description}
            rows={5}
            onChange={(e) => setDescription(e.target.value)}
          />
          <p className="text-xs text-gray-400">
            Get your members on board with few words about your workspace.
          </p>
        </div>

        <button
          disabled={isPending}
          className="w-full bg-black text-white p-3 rounded"
        >
          {isPending ? "Creating..." : "Create Workspace"}
        </button>
      </form>
      <div className="w-1/2 h-110 bg-amber-300">
        <img className="w-full h-full object-cover" src={workspace} alt="" />
      </div>
    </div>
  );
};

export default CreateWorkspaceForm;
