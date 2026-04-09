import Comment from "./comment.model.js";

export const createCommentService = async (userId, orgId, data) => {
  const comment = await Comment.create({
    ...data,
    user: userId,
    organization: orgId,
  });
  return comment;
};

export const getCommentsService = async (taskId) => {
  const comments = await Comment.find({ task: taskId, parentComment: null })
    .populate("user", "name email")
    .lean();
  return comments;
};
