import { useState } from "react";
import { useCreateTask, useUpdateTask } from "../api/mutations/task.mutation";
import { useModal } from "../context/ModalContext";
import { useProjects } from "../api/queries/project.query";
import { useMembers } from "../api/queries/member.query";
import { toast } from "sonner";

const CreateTaskForm = ({ projectId, editTask }) => {
  const isEdit = !!editTask;

  const { closeModal } = useModal();
  const { mutate: createTask, isPending } = useCreateTask();
  const { mutate: updateTask, isPending: updating } = useUpdateTask();

  const { data: projects = [] } = useProjects({ limit: 100 });
  const { data: membersData = {} } = useMembers({ limit: 100 });

  const members = membersData?.data || [];

  const [form, setForm] = useState({
    title: editTask?.title || "",
    description: editTask?.description || "",
    project: editTask?.project?._id || editTask?.project || projectId || "",
    assignedTo: editTask?.assignedTo?._id || "",
    dueDate: editTask?.dueDate?.slice(0, 10) || "",
    status: editTask?.status || "todo",
    priority: editTask?.priority || "medium",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      return setError("Task title is required.");
    }
    if (!form.project) {
      return setError("Please select a project for this task.");
    }

    const payload = {
      ...form,
      assignedTo: form.assignedTo ? form.assignedTo : undefined,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
    };

    if (isEdit) {
      delete payload.status;

      updateTask(
        {
          id: editTask._id,
          data: payload,
        },
        {
          onSuccess: () => {
            closeModal();
            toast.success("Task updated");
          },
          onError: (err) => {
            setError(err.response?.data?.message || "Failed to create task");
          },
        },
      );
    } else {
      createTask(payload, {
        onSuccess: () => {
          closeModal();
          toast.success("Task created");
        },
        onError: (err) => {
          setError(err.response?.data?.message || "Failed to create task");
        },
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-100">
      <div>
        <h1 className="text-xl font-bold ">
          {isEdit ? "Edit Task" : "Create Task"}
        </h1>
        <p className="text-gray-600 text-sm">
          {isEdit
            ? "Update task details and save changes"
            : "Fill in the details below to create a new task."}
        </p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Title */}
      <div className="space-y-1">
        <p>Task title</p>
        <input
          type="text"
          name="title"
          placeholder="Task title"
          className="w-full border p-2 rounded"
          value={form.title}
          onChange={handleChange}
        />
      </div>

      {/* Description */}
      <div className="space-y-1">
        <p>Task description</p>
        <textarea
          name="description"
          placeholder="Description (optional)"
          className="w-full border p-2 rounded"
          rows={2}
          value={form.description}
          onChange={handleChange}
        />
      </div>

      {/* Project */}
      <div className="space-y-1">
        <p>Project</p>

        {projectId ? (
          <div className="p-2 border rounded">
            {projects.find((p) => p._id === projectId)?.name ||
              "Selected Project"}
          </div>
        ) : (
          <select
            name="project"
            className="w-full border p-2 rounded"
            value={form.project}
            disabled={!!projectId || isEdit}
            onChange={handleChange}
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Assigned To */}
      <div className="space-y-1">
        <p>Assigned To</p>
        <select
          name="assignedTo"
          className="w-full border p-2 rounded"
          value={form.assignedTo}
          onChange={handleChange}
        >
          <option value="">Assign to (optional)</option>
          {members?.length > 0 &&
            members?.map((m) => (
              <option key={m._id} value={m._id}>
                {m.name}
              </option>
            ))}
        </select>
      </div>

      {/* Due Date */}
      <div className="space-y-1">
        <p>Due Date</p>
        <input
          type="date"
          name="dueDate"
          placeholder="Pick a due date (optional)"
          className="w-full border p-2 rounded"
          value={form.dueDate}
          onChange={handleChange}
        />
      </div>

      {/* Status */}
      <div className="space-y-1">
        <p>Status</p>
        <select
          name="status"
          className="w-full border p-2 rounded"
          disabled={isEdit}
          value={form.status}
          onChange={handleChange}
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="submitted">Submitted</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Priority */}
      <div className="space-y-1">
        <p>Priority</p>
        <select
          name="priority"
          className="w-full border p-2 rounded"
          value={form.priority}
          onChange={handleChange}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={isPending || updating}
        className="w-full bg-black text-white py-2 rounded cursor-pointer hover:opacity-90 disabled:bg-gray-400"
      >
        {isEdit
          ? updating
            ? "Updating..."
            : "Update Task"
          : isPending
            ? "Creating..."
            : "Create Task"}
      </button>
    </form>
  );
};

export default CreateTaskForm;
