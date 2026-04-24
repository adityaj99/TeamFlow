import React, { useState } from "react";
import { useModal } from "../context/ModalContext";
import { useCreateProject } from "../api/mutations/project.mutation";

import { toast } from "sonner";

const CreateProjectForm = () => {
  const { closeModal } = useModal();

  const { mutate: createProject, isPending } = useCreateProject();

  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [error, setError] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return setError("Project name is required");
    }

    createProject(
      { name, description },
      {
        onSuccess: () => {
          closeModal();
          toast.success("Project created!");
        },
        onError: (err) =>
          setError(err.response?.data?.message || "Failed to create project"),
      },
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">Create Project</h2>
        <p className="text-gray-400">
          Organize and manage tasks, resources and team collaboration.
        </p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="space-y-1">
        <p>Project name</p>
        <input
          type="text"
          placeholder="Project name"
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <p className="text-xs text-gray-400">
          This is the name of project in your organization.
        </p>
      </div>

      <div className="space-y-1">
        <p>
          Project description{" "}
          <span className="text-gray-400 ml-1">Optional</span>
        </p>
        <textarea
          type="text"
          placeholder="e.g. Our team organize projects and tasks here"
          className="w-full border p-2 rounded"
          value={description}
          rows={5}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button
        disabled={!name?.trim() || isPending}
        className="w-full bg-black text-white p-3 rounded cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-400 hover:opacity-90 transition"
      >
        {isPending ? "Creating..." : "Create Project"}
      </button>
    </form>
  );
};

export default CreateProjectForm;
