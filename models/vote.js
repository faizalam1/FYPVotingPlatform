import { Schema, model, models } from "mongoose";

const VoteSchema = new Schema({
  campaignID: {
    type: Schema.Types.ObjectId,
    ref: "Campaign",
    required: [true, "Vote campaign is required!"],
  },
  VoterID: {
    type: String,
    required: [true, "Voter ID is required!"],
  },
  type: {
    type: String,
    enum: ["Default", "Ranked"],
    required: [true, "Vote type is required!"],
  },
  Vote: [
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
