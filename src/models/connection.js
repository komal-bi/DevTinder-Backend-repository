const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
      enum: ["interested", "ignored", "accepted", "rejected"],
      message: `{VALUE} is not accepted...status should be one of ['interested','ignored','accepted','rejected']`,
    },
  },
  { timestamps: true },
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function () {
  let connection = this;
  if (connection.fromUserId.equals(connection.toUserId)) {
    throw new Error("Cannot send connection request to self");
  }
});

const ConnectionRequest = new mongoose.model(
  "connection request",
  connectionRequestSchema,
);

module.exports = ConnectionRequest;
