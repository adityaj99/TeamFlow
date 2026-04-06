import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    organization: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true,
    },
    role: {
      type: String,
      enum: ["manager", "admin", "member"],
      required: true,
    },
    token: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "expired"],
      required: true,
      default: "pending",
    },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true },
);

const Invite = mongoose.model("Invite", inviteSchema);

export default Invite;
