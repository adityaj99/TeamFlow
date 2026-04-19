import Membership from "../membership/membership.model.js";
import { createOrganization } from "./org.service.js";

export const createOrg = async (req, res, next) => {
  try {
    const org = await createOrganization(req.user._id, req.body);
    res
      .status(201)
      .json({ success: true, message: "Organization created", org });
  } catch (error) {
    next(error);
  }
};

export const getMembersOfOrg = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const [members, total] = await Promise.all([
      Membership.find({
        organization: req.orgId,
        status: "active",
      })
        .populate("user", "name email")
        .select("user role createdAt")
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),

      Membership.countDocuments({
        organization: req.orgId,
        status: "active",
      }),
    ]);

    const formatted = members.map((m) => ({
      _id: m.user._id,
      name: m.user.name,
      email: m.user.email,
      role: m.role,
      createdAt: m.createdAt,
    }));

    res.status(200).json({
      success: true,
      data: formatted,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
