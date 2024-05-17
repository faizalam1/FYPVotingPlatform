import { Schema, model, models } from "mongoose";

const CampaignSchema = new Schema({
    name: {
        type: String,
        match: [/^[a-zA-Z0-9 ]+$/, "Campaign name is invalid!"],
        required: [true, "Campaign name is required!"],
    },
    description: {
        type: String,
        maxLength: [500, "Campaign description is too long!"],
        minLength: [10, "Campaign description is too short!"],
        required: [true, "Campaign description is required!"],
    },
    votingType: {
        type: String,
        enum: ["Default", "Ranked"],
        required: [true, "Campaign voting type is required!"],
    },
    startDateTime: {
        type: Date,
        required: [true, "Campaign start date is required!"],
    },
    endDateTime: {
        type: Date,
        min: [Date.now, "Campaign end date is invalid!"],
        required: [true, "Campaign end date is required!"],
    },
    isRestrictedByEmail: {
        type: Boolean,
        default: false,
    },
    allowedDomains: {
        type: [String],
        default: [],
    },
    viewResults: {
        type: String,
        enum: ["PostVoting", "Live"],
        required: [true, "Campaign view results is required!"],
    },
    isResultsPublic: {
        type: Boolean,
        default: false,
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