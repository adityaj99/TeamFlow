import {
  createCommentService,
  getCommentsService,
  getRepliesService,
} from "./comment.service.js";

export const createComment = async (req, res, next) => {
  try {
    const comment = await createCommentService(
      req.user._id,
      req.orgId,
      req.body,
    );
    res.status(201).json({
      success: true,
      message: "Comment created",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};

export const getComments = async (req, res, next) => {
  try {
    const comments = await getCommentsService(req.params.taskId);
    res.status(200).json({
      success: true,
      data: comments,
    });
  } catch (error) {
    next(error);
  }
};

export const getReplies = async (req, res, next) => {
  try {
    const replies = await getRepliesService(req.params.commentId);

    res.status(200).json({
      success: true,
      data: replies,
    });
  } catch (error) {
    next(error);
  }
};
