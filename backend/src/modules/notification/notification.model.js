import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: ["TASK_ASSIGNED", "TASK_SUBMITTED", "TASK_APPROVED", "INVITE_SENT"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  { timestamps: true },
);

notificationSchema.index({ user: 1 });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
