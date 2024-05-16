import { Schema, model, models } from "mongoose";

const VoteSchema = new Schema({
  campaignID: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
    required: [true, "Vote campaign ID is required!"],
  },
  voterID: {
    type: String,
    required: [true, "Voter ID is required!"],
  },
  type: {
    type: String,
    enum: ["Default", "Ranked"],
    required: [true, "Vote type is required!"],
  },
  vote: [
    {
      candidateID: {
        type: Schema.Types.ObjectId,
        ref: "Candidate",
        required: [true, "Vote candidate is required!"],
      },
      rank: {
        type: Number,
        required: function () {
          return this.type === "ranked";
        },
      },
    },
  ],
  votedAt: {
    type: Date,
    default: Date.now,
  },
});

VoteSchema.index({ campaignID: 1, voterID: 1 }, { unique: true });

const Vote = models.Vote || model("Vote", VoteSchema);
export default Vote;