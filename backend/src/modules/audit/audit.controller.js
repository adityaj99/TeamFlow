import Audit from "./audit.model.js";

export const getAuditLogs = async (req, res, next) => {
  try {
    const { targetId, targetType, page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    if (targetId) filter.targetId = targetId;
    if (targetType) filter.targetType = targetType;

    filter.organization = req.orgId;

    const [audits, total] = await Promise.all([
      Audit.find(filter)
        .populate("user", "name email avatar")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Audit.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: audits,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};
