import { Schema, model, models } from "mongoose";

const CandidateSchema = new Schema({
    name: {
        type: String,
        required: [true, "Candidate name is required!"],
    },
    description: {
        type: String,
        maxLength: [1024, "Campaign description is too long!"],
        default: ""
    },
    image: {
        type: String,
        default: ""
    },
    additionalFields: {
        type: [
            {
                name: {
                    type: String,
                    required: [true, "Additional field name is required!"],
                },
                value: {
                    type: String,
                    required: [true, "Additional field value is required!"],
                },
            },
        ],
        default: [],
    },
    campaignID: {
        type: Schema.Types.ObjectId,
        ref: "Campaign",
        required: [true, "Candidate campaign is required!"],
    }
});

CandidateSchema.index({ name: 1, campaignID: 1 }, { unique: true });

const Candidate = models.Candidate || model("Candidate", CandidateSchema);
export default Candidate;