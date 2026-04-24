import Audit from "./audit.model.js";

export const getAuditLogs = async (req, res, next) => {
  try {
    const { targetId, targetType, page = 1, limit = 10 } = req.query;

    console.log("Received Audit Log Request:", {
      targetId,
      targetType,
      page,
      limit,
      orgId: req.orgId,
    });

    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const filter = {};

    if (targetId) filter.targetId = targetId;
    if (targetType) filter.targetType = targetType;

    filter.organization = req.orgId;

    console.log("Audit Filter:", filter);

    const audits = await Audit.find(filter)
      .populate("user", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    console.log("Fetched Audits:", audits);

    const total = await Audit.countDocuments(filter);

    console.log("Total Audit Logs:", total);

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
