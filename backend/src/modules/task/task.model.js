import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["todo", "in_progress", "submitted", "approved", "rejected"],
      required: true,
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      required: true,
      default: "medium",
    },
    dueDate: {
      type: Date,
    },
    submission: {
      note: {
        type: String,
      },
      attachments: [
        {
          type: String,
        },
      ],
      submittedAt: {
        type: Date,
      },
    },
  },
  { timestamps: true },
);

taskSchema.index({ organization: 1 });
taskSchema.index({ assignedTo: 1 });

const Task = mongoose.model("Task", taskSchema);

export default Task;
