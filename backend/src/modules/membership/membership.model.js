import mongoose from "mongoose";

const membershipSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    role: {
      type: String,
      enum: ["owner", "admin", "manager", "member"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "invited", "removed"],
      required: true,
      default: "active",
    },
  },
  { timestamps: true },
);

membershipSchema.index({ user: 1, organization: 1 }, { unique: true });
membershipSchema.index({ user: 1, status: 1 });
membershipSchema.index({ organization: 1, status: 1 });

const Membership = mongoose.model("Membership", membershipSchema);

export default Membership;
