import { updateOrgSchema } from "../../validations/org.validation.js";
import Membership from "../membership/membership.model.js";
import Organization from "./org.model.js";
import {
  createOrganization,
  deleteOrgnizationService,
  updateOrganizationService,
} from "./org.service.js";

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
        .populate("user", "name email avatar")
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
      avatar: m.user.avatar,
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

export const getActiveOrg = async (req, res, next) => {
  try {
    const orgId = req.orgId;
    const activeOrg = await Organization.findById(orgId);

    if (!activeOrg) {
      const error = new Error("Organization not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: activeOrg,
    });
  } catch (error) {
    next(error);
  }
};

export const updateOrganization = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const validatedData = updateOrgSchema.parse(req.body);

    const updated = await updateOrganizationService({
      orgId: req.orgId,
      name: validatedData.name,
      description: validatedData.description,
      role: req.role,
    });

    res.status(200).json({
      success: true,
      message: "Organization updated",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteOrgnization = async (req, res, next) => {
  try {
    await deleteOrgnizationService({
      orgId: req.orgId,
      role: req.role,
    });

    res.clearCookie("activeOrg");

    res.json({
      success: true,
      message: "Organization deleted",
    });
  } catch (error) {
    next(error);
  }
};
