import { Schema, model, models } from "mongoose";


const UserVerificationSchema = new Schema({
    _userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
        unique: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 7200,
    },
    attempts: {
        type: Number,
        required: true,
        default: 0,
    }
    })

export const UserVerification = models.UserVerification || model("UserVerification", UserVerificationSchema);
export default UserVerification;