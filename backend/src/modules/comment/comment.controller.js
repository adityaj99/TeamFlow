import { createCommentService, getCommentsService } from "./comment.service.js";

export const createComment = async (req, res) => {
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
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await getCommentsService(req.params.taskId);
    res.status(200).json({
      success: true,
      message: "Comments retrieved",
      data: comments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
