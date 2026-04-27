import { createNotifcationService } from "../notification/notification.service.js";
import Task from "../task/task.model.js";
import Comment from "./comment.model.js";

export const createCommentService = async (userId, orgId, data) => {
  const task = await Task.findOne({ _id: data.task, organization: orgId });

  if (!task) {
    const error = new Error("Task not found or access denied");
    error.status = 404;
    throw error;
  }

  const comment = await Comment.create({
    ...data,
    user: userId,
    organization: orgId,
  });

  if (task.assignedTo && task.assignedTo.toString() !== userId.toString()) {
    await createNotifcationService({
      userId: task.assignedTo,
      orgId: orgId,
      type: "TASK_COMMENT",
      message: `Someone left a new comment on your task: ${task.title}`,
      relatedId: task._id,
    });
  }

  return comment;
};

export const getCommentsService = async (taskId) => {
  const comments = await Comment.find({
    task: taskId,
    organization: orgId,
    parentComment: null,
  })
    .populate("user", "name email avatar")
    .lean();
  return comments;
};

export const getRepliesService = async (commentId) => {
  const replies = await Comment.find({
    parentComment: commentId,
    organization: orgId,
  })
    .populate("user", "name email avatar")
    .lean();

  return replies;
};
