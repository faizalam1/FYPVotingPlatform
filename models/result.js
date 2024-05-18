import { Schema, model, models } from "mongoose";

const ResultSchema = new Schema({
    campaignID: {
        type: Schema.Types.ObjectId,
        ref: "Campaign",
        required: [true, "Result campaign ID is required!"],
        unique: true,
    },
    type: {
        type: String,
        enum: ["Default", "Ranked"],
        required: [true, "Result type is required!"],
    },
    result: [
        {
            candidateID: {
                type: Schema.Types.ObjectId,
                ref: "Candidate",
                required: [true, "Result candidate is required!"],
            },
            votes: {
                type: Number,
                required: [true, "Result votes is required!"],
            },
        },
    ],
    countedAt: {
        type: Date,
        default: Date.now,
    },
});

const Result = models.Result || model("Result", ResultSchema);
export default Result;