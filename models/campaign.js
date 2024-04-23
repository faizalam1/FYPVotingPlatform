import { Schema, model, models } from "mongoose";

const CampaignSchema = new Schema({
    name: {
        type: String,
        required: [true, "Campaign name is required!"],
    },
    description: {
        type: String,
        required: [true, "Campaign description is required!"],
    },
    VotingType: {
        type: String,
        enum: ["Default", "Ranked"],
        required: [true, "Campaign voting type is required!"],
    },
    startDate: {
        type: String,
        required: [true, "Campaign start date is required!"],
    },
    endDate: {
        type: String,
        required: [true, "Campaign end date is required!"],
    },
    isRestricted: {
        type: Boolean,
        default: false,
    },
    restrictedDomains: {
        type: [String],
        default: [],
    },
    numberOfCandidates: {
        type: Number,
        required: [true, "Campaign number of candidates is required!"],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Campaign creator is required!"],
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    });

CampaignSchema.index({ name: 1, createdBy: 1 }, { unique: true });

const Campaign = models.Campaign || model("Campaign", CampaignSchema);
export default Campaign;