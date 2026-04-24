import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
    },
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
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    targetType: {
      type: String,
    },
    metadata: {
      type: Object,
    },
  },
  { timestamps: true },
);

auditSchema.index({ organization: 1 });
auditSchema.index({ targetId: 1, targetType: 1 });
auditSchema.index({ createdAt: -1 });

const Audit = mongoose.model("Audit", auditSchema);

export default Audit;
