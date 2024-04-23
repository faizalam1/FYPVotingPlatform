import { Schema, model, models } from "mongoose";

const CandidateSchema = new Schema({
    name: {
        type: String,
        required: [true, "Candidate name is required!"],
    },
    description: {
        type: String,
        required: [true, "Candidate description is required!"],
    },
    image: {
        type: String,
        required: [true, "Candidate image is required!"],
    },
    campaignId: {
        type: Schema.Types.ObjectId,
        ref: "Campaign",
        required: [true, "Candidate campaign is required!"],
    }
});

CandidateSchema.index({ name: 1, campaignId: 1 }, { unique: true });

const Candidate = models.Candidate || model("Candidate", CandidateSchema);