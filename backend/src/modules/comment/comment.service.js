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
    .populate("user", "name email avatar")
    .lean();
  return comments;
};

export const getRepliesService = async (commentId) => {
  const replies = await Comment.find({ parentComment: commentId })
    .populate("user", "name email avatar")
    .lean();

  return replies;
};
